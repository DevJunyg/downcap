import { render, unmountComponentAtNode } from "react-dom";
import TranslatedCaptionOutContent from "./TranslatedCaptionOutContent"
import { act } from "react-dom/test-utils";

let container: HTMLDivElement | null = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container!);
  container!.remove();
  container = null;
});

it('render with check render exit-button', async () => {
  act(() => {
    render(
      <TranslatedCaptionOutContent highlight={true} />, container);
  });
  
  let RemoveButton = container!.children[0].children[0] as HTMLDivElement;

  expect(RemoveButton).toHaveClass("exit");
})
