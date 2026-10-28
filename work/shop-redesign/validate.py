from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote
from collections import Counter

root = Path(__file__).resolve().parents[2]
class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids=[]; self.refs=[]; self.controls=[]
    def handle_starttag(self, tag, pairs):
        attrs=dict(pairs)
        if attrs.get('id'): self.ids.append(attrs['id'])
        if tag in ['img','script','link','source','a']:
            ref=attrs.get('href') if tag in ['a','link'] else attrs.get('src',attrs.get('data-src'))
            if ref and not urlparse(ref).scheme and not ref.startswith('//'): self.refs.append(ref)
        if attrs.get('aria-controls'): self.controls.append(attrs['aria-controls'])

pages={}
for name in ['index.html','sucursales.html','suscripciones.html']:
    parser=Page(); parser.feed((root/name).read_text(encoding='utf-8')); pages[name]=parser
errors=[]
for name,page in pages.items():
    for id,count in Counter(page.ids).items():
        if count>1: errors.append(f'{name}: duplicate id {id}')
    for control in page.controls:
        if control not in page.ids: errors.append(f'{name}: missing controlled element {control}')
    for ref in page.refs:
        url=urlparse(ref); path=unquote(url.path) or name
        if not (root/path).exists(): errors.append(f'{name}: missing {path}')
        if url.fragment and path in pages and url.fragment not in pages[path].ids: errors.append(f'{name}: missing anchor {ref}')
print(f'Checked {len(pages)} pages, {sum(len(p.refs) for p in pages.values())} local references and all disclosure targets.')
print('\n'.join(errors) if errors else 'PASS: no missing local files, anchors, duplicate ids or disclosure targets.')
raise SystemExit(bool(errors))
