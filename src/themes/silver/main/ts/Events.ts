import { Channels, Attachment } from '@ephox/alloy';
import { document } from '@ephox/dom-globals';
import { Arr } from '@ephox/katamari';
import { DomEvent, Element } from '@ephox/sugar';

const setup = (editor, mothership, uiMothership) => {
  const onMousedown = DomEvent.bind(Element.fromDom(document), 'mousedown', function (evt) {
    Arr.each([ mothership, uiMothership ], function (ship) {
      ship.broadcastOn([ Channels.dismissPopups() ], {
        target: evt.target()
      });
    });
  });

  const onTouchstart = DomEvent.bind(Element.fromDom(document), 'touchstart', function (evt) {
    Arr.each([ mothership, uiMothership ], function (ship) {
      ship.broadcastOn([ Channels.dismissPopups() ], {
        target: evt.target()
      });
    });
  });

  const onMouseup = DomEvent.bind(Element.fromDom(document), 'mouseup', function (evt) {
  if (evt.raw().button === 0) {
    Arr.each([ mothership, uiMothership ], function (ship) {
      ship.broadcastOn([ Channels.mouseReleased() ], {
        target: evt.target()
      });
    });
  }
  });

  const onContentMousedown = function (raw) {
    Arr.each([ mothership, uiMothership ], function (ship) {
      ship.broadcastOn([ Channels.dismissPopups() ], {
        target: Element.fromDom(raw.target)
      });
    });
  };
  editor.on('mousedown', onContentMousedown);
  editor.on('touchstart', onContentMousedown);

  const onContentMouseup = function (raw) {
  if (raw.button === 0) {
    Arr.each([ mothership, uiMothership ], function (ship) {
      ship.broadcastOn([ Channels.mouseReleased() ], {
        target: Element.fromDom(raw.target)
      });
    });
  }
  };
  editor.on('mouseup', onContentMouseup);

  editor.on('remove', () => {
    // We probably don't need these unbinds, but it helps to have them if we move this code out.
    editor.off('mousedown', onContentMousedown);
    editor.off('touchstart', onContentMousedown);
    editor.off('mouseup', onContentMouseup);
    Attachment.detachSystem(mothership);
    Attachment.detachSystem(uiMothership);
    mothership.destroy();
    uiMothership.destroy();

    onMousedown.unbind();
    onTouchstart.unbind();
    onMouseup.unbind();
  });
};

export default { setup };