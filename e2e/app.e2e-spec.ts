import { ToothlabV4Page } from './app.po';

describe('toothlab-v4 App', () => {
  let page: ToothlabV4Page;

  beforeEach(() => {
    page = new ToothlabV4Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
