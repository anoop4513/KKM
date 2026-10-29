from pathlib import Path
from urllib.parse import urlparse
import json
import re
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
origin = 'https://kkmedia-5n9j19e33-anoop4513s-projects.vercel.app'
token = ''
for line in (root/'.env.local').read_text(encoding='utf-8-sig').splitlines():
    if line.startswith('VERCEL_OIDC_TOKEN='):
        token = line.split('=',1)[1].strip().strip('"').strip("'")
if not token:
    raise RuntimeError('A local development credential is required; its value is never logged.')
headers = {'x-vercel-trusted-oidc-idp-token':token}
report = {'origin':origin,'routes':[],'errors':[]}

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',headless=True)
    context = browser.new_context(viewport={'width':1440,'height':1106})
    def authenticate(route):
        if urlparse(route.request.url).netloc == urlparse(origin).netloc:
            route.continue_(headers={**route.request.headers,**headers})
        else:
            route.continue_()
    context.route('**/*',authenticate)
    page=context.new_page()
    page.on('pageerror',lambda error:report['errors'].append(str(error)))
    response=page.goto(origin+'/',wait_until='networkidle')
    assert response.status == 200, f'Homepage status {response.status}'
    assert page.locator('h1').inner_text().startswith('Creative.'), 'Protected response did not reach application'
    page.evaluate('document.fonts.ready')
    page.screenshot(path=str(root/'.impeccable/review/live-desktop.png'))
    assert page.locator('meta[name="robots"]').get_attribute('content') == 'noindex, nofollow'
    assert page.locator('link[rel="canonical"]').get_attribute('href') == origin+'/'
    sitemap=context.request.get(origin+'/sitemap.xml',headers=headers)
    assert sitemap.status == 200
    urls=re.findall(r'<loc>(.*?)</loc>',sitemap.text())
    assert len(urls) == 22
    titles=set()
    for url in urls:
        result=context.request.get(url,headers=headers)
        text=result.text()
        title=re.search(r'<title>(.*?)</title>',text).group(1)
        assert result.status==200 and '<h1' in text and 'noindex, nofollow' in text
        titles.add(title)
        report['routes'].append({'path':urlparse(url).path,'status':result.status,'title':title})
    assert len(titles)==22
    readiness=context.request.get(origin+'/api/enquiries',headers=headers)
    state=readiness.json()
    assert readiness.status==200 and state['ready'] is False
    report['enquiry_readiness']=state
    page.goto(origin+'/contact/',wait_until='networkidle')
    assert page.get_by_role('button',name='Send project enquiry').is_disabled()
    assert page.get_by_role('link',name='Email your brief',exact=True).is_visible()
    page.set_viewport_size({'width':390,'height':844})
    assert page.evaluate('document.documentElement.scrollWidth')==390
    assert page.locator('.mobile-proposal').count()==0
    page.screenshot(path=str(root/'.impeccable/review/live-mobile-contact.png'),full_page=True)
    browser.close()

assert not report['errors'],report['errors']
(root/'.impeccable/review/live-report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps({'origin':origin,'route_count':len(report['routes']),'unique_titles':len(titles),'enquiry_ready':False,'browser_errors':report['errors']},indent=2))
