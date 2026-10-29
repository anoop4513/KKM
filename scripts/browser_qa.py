from pathlib import Path
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '.impeccable' / 'review'
OUT.mkdir(parents=True, exist_ok=True)
report = {'errors': [], 'checks': {}}

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 1106}, device_scale_factor=1)
    page.on('pageerror', lambda error: report['errors'].append(str(error)))
    page.on('console', lambda message: report['errors'].append(message.text) if message.type == 'error' else None)
    page.goto('http://127.0.0.1:5173/', wait_until='networkidle')
    page.evaluate('document.fonts.ready')
    page.wait_for_timeout(350)
    assert page.locator('h1').count() == 1
    assert page.get_by_role('heading', name='Creative. Marketing. Technology. One Growth Partner.').count() == 1
    def motion_values():
        return page.evaluate('''() => ({angle:document.querySelector('.lens-turn').style.getPropertyValue('--scroll-rotation'), layers:[...document.querySelectorAll('.hero-art [data-parallax]')].map(e=>parseFloat(e.style.getPropertyValue('--parallax-y'))),word:getComputedStyle(document.querySelector('.word')).opacity})''')
    start = motion_values()
    page.evaluate("document.documentElement.style.scrollBehavior='auto'; window.scrollTo(0,550)")
    page.wait_for_timeout(180)
    down = motion_values()
    page.wait_for_timeout(250)
    still = motion_values()
    page.evaluate('window.scrollTo(0,0)')
    page.wait_for_timeout(180)
    back = motion_values()
    assert start['angle'] != down['angle'], 'Rotation did not respond to scrolling'
    assert down['angle'] == still['angle'], 'Rotation changed without scrolling'
    assert start['angle'] == back['angle'], 'Rotation did not reverse to original angle'
    layer_deltas = [round(b-a, 2) for a,b in zip(start['layers'], down['layers'])]
    assert len(set(layer_deltas)) == 3, 'Parallax layers need different speeds'
    report['checks']['scroll_motion'] = {'start':start, 'down':down, 'back':back, 'layer_deltas':layer_deltas}
    page.locator('.positioning').scroll_into_view_if_needed()
    page.wait_for_timeout(180)
    reveal = page.locator('.word').first.evaluate('(e)=>getComputedStyle(e).opacity')
    assert float(reveal) > float(start['word']), 'Word reveal did not respond to scroll'
    report['checks']['word_reveal'] = {'before':start['word'],'after':reveal}
    page.locator('#create').scroll_into_view_if_needed()
    create_top = page.locator('#create').evaluate('(e)=>e.offsetTop')
    page.evaluate('window.scrollTo(0,document.querySelector(".chapter-stack").getBoundingClientRect().top+scrollY+320)')
    page.wait_for_timeout(150)
    cards = page.locator('.chapter').evaluate_all('(es)=>es.map(e=>({top:e.getBoundingClientRect().top,position:getComputedStyle(e).position}))')
    assert cards[0]['position'] == 'sticky' and cards[0]['top'] <= 30
    report['checks']['stacking'] = cards
    page.get_by_role('button', name='Education', exact=True).click()
    assert page.locator('.portfolio-item').count() == 2
    page.get_by_role('button', name='All work', exact=True).click()
    assert page.locator('.portfolio-item').count() == 6
    report['checks']['filters'] = True
    page.locator('.studio-eyes').scroll_into_view_if_needed()
    box = page.locator('.studio-eyes').bounding_box()
    page.mouse.move(box['x'] + box['width']*.85, box['y'] + box['height']*.6)
    page.wait_for_timeout(320)
    eyes = page.locator('.studio-eyes').evaluate('''e => ({head:parseFloat(e.style.getPropertyValue('--studio-head-x')), pupil:parseFloat(e.style.getPropertyValue('--studio-pupil-x'))})''')
    assert abs(eyes['pupil']) > abs(eyes['head']) > 0, eyes
    report['checks']['cursor_tracking'] = eyes
    report['checks']['responsive'] = []
    for width in [320,390,768,1024,1440]:
        page.set_viewport_size({'width':width,'height':844 if width<700 else 1106})
        page.evaluate('window.scrollTo(0,0)')
        page.wait_for_timeout(100)
        size = page.evaluate('({viewport:innerWidth,document:document.documentElement.scrollWidth})')
        assert size['document'] <= width, f'Horizontal overflow at {width}: {size}'
        report['checks']['responsive'].append(size)
    page.set_viewport_size({'width':1440,'height':1106})
    page.evaluate('window.scrollTo(0,0)')
    page.wait_for_timeout(200)
    page.screenshot(path=str(OUT/'desktop-hero.png'))
    page.add_style_tag(content='.word-reveal-ready .word{opacity:1!important;transform:none!important}')
    page.screenshot(path=str(OUT/'desktop.png'), full_page=True)
    page.set_viewport_size({'width':390,'height':844})
    page.reload(wait_until='networkidle')
    page.evaluate('document.fonts.ready')
    page.wait_for_timeout(180)
    page.screenshot(path=str(OUT/'mobile-hero.png'))
    page.add_style_tag(content='.word-reveal-ready .word{opacity:1!important;transform:none!important}')
    page.screenshot(path=str(OUT/'mobile.png'), full_page=True)
    page.get_by_role('button', name='Open navigation').click()
    assert page.locator('#mobile-nav').is_visible()
    page.keyboard.press('Escape')
    assert page.get_by_role('button', name='Open navigation').get_attribute('aria-expanded') == 'false'
    page.goto('http://127.0.0.1:5173/contact/?service=creative-media-production',wait_until='networkidle')
    assert page.locator('#enquiry-service').input_value() == 'creative-media-production'
    assert page.get_by_role('button',name='Send project enquiry').is_disabled()
    assert page.get_by_role('link',name='Email your brief',exact=True).is_visible()
    assert page.locator('input[autocomplete="email"]').count() == 1
    page.screenshot(path=str(OUT/'mobile-contact.png'),full_page=True)
    report['checks']['unconfigured_form'] = True
    page.set_viewport_size({'width':1440,'height':1106})
    page.goto('http://127.0.0.1:5173/services/ai-business-automation/',wait_until='networkidle')
    assert page.get_by_text('Consultation-led capability.',exact=False).is_visible()
    page.screenshot(path=str(OUT/'desktop-service.png'),full_page=True)
    reduced = browser.new_page(viewport={'width':390,'height':844},reduced_motion='reduce')
    reduced.goto('http://127.0.0.1:5173/',wait_until='networkidle')
    state = reduced.evaluate('''()=>({motion:document.querySelector('.website').className,word:getComputedStyle(document.querySelector('.word')).opacity,card:getComputedStyle(document.querySelector('.chapter')).position,turn:getComputedStyle(document.querySelector('.lens-turn')).transform})''')
    assert 'motion-off' in state['motion'] and state['word'] == '1' and state['card'] != 'sticky' and state['turn'] == 'none'
    report['checks']['reduced_motion'] = state
    browser.close()

(OUT/'browser-report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report,indent=2))
assert not report['errors'], report['errors']
