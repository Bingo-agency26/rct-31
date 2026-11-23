"""Integration checks: run with Python + PyYAML + BeautifulSoup and Jekyll available."""
import os, re, shutil, subprocess, tempfile
from pathlib import Path
from urllib.parse import urlsplit, unquote
import yaml
from bs4 import BeautifulSoup
root=Path(__file__).resolve().parents[1]
# The command can be overridden to use an isolated Bundler installation.
import shlex
command=shlex.split(os.environ.get('JEKYLL_COMMAND','bundle exec jekyll'))
with tempfile.TemporaryDirectory() as tmp:
    src=Path(tmp)/'source'; out=Path(tmp)/'output'
    shutil.copytree(root,src,ignore=shutil.ignore_patterns('.git','_site','vendor','.bundle'))
    def build():
        subprocess.run(command+['build','--source',str(src),'--destination',str(out)],check=True,stdout=subprocess.DEVNULL)
    def soup(name):return BeautifulSoup((out/name).read_text(),'html.parser')
    def check_links():
        for p in out.glob('*.html'):
            s=soup(p.name)
            assert '{{' not in str(s) and '{%' not in str(s),p.name
            for t in s.select('[src],a[href],link[href]'):
                url=t.get('src') or t.get('href'); u=urlsplit(url)
                if u.scheme or u.netloc or not u.path:continue
                assert (out/unquote(u.path).removeprefix('./')).is_file(),(p.name,url)
    build();check_links()
    assert len(soup('blog.html').select('.journal-card'))==5
    for slug in ['visiter-toulouse','visiter-tarbes','depart-aeroport','voyage-professionnel','escapade-lauragais']:
        assert (out/(slug+'.html')).is_file()
    for name in ['contact.html','services.html','mentions.html','assets/booking.js','assets/callback.js','assets/email-service.js']:
        assert (root/name).read_bytes()==(out/name).read_bytes(),name
    test=src/'_posts/2026-11-23-test-cms.md'
    data=dict(title='Test CMS & accents é',description='Résumé de contrôle',topic='Tourisme',label='Test',published=False,image='/assets/blog/toulouse.webp',image_alt='Photo test')
    def write():test.write_text('---\n'+yaml.safe_dump(data,allow_unicode=True)+'---\n\n## Texte du test\n\nUn paragraphe **en gras**.\n\n![Photo intérieure](/assets/blog/tarbes.webp)\n')
    write();build()
    assert not (out/'test-cms.html').exists()
    assert len(soup('blog.html').select('.journal-card'))==5
    data['published']=True;write();build();check_links()
    assert (out/'test-cms.html').exists()
    assert len(soup('blog.html').select('.journal-card'))==6
    assert soup('index.html').select_one('a[href="./test-cms.html"]')
    assert soup('test-cms.html').select_one('strong').get_text()=='en gras'
    data['title']='Titre modifié';data['image']='/assets/blog/tarbes.webp';write();build()
    assert soup('test-cms.html').h1.get_text()=='Titre modifié'
    assert soup('test-cms.html').select_one('.article img')['src']=='./assets/blog/tarbes.webp'
    data['published']=False;write();build()
    assert not (out/'test-cms.html').exists()
    assert not soup('index.html').select_one('a[href="./test-cms.html"]')
    assert len(soup('blog.html').select('.journal-card'))==5
    # Unpublishing an existing post also removes its entry from both lists.
    p=src/'_posts/2026-11-22-visiter-toulouse.md';p.write_text(p.read_text().replace('published: true','published: false'))
    build()
    assert not (out/'visiter-toulouse.html').exists()
    assert not soup('index.html').select_one('a[href="./visiter-toulouse.html"]')
    assert not soup('blog.html').select_one('a[href="./visiter-toulouse.html"]')
print('PASS: existing URLs, all local links/images, unchanged forms, draft/create/publish/edit/unpublish, homepage synchronization.')
