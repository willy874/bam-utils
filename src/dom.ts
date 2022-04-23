function conditionData(value: unknown, defaultValue: unknown) {
  return value === defaultValue ? defaultValue : value || defaultValue;
}

const png1px = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAC4jAAAuIwF4pT92AAAE7mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuYTg3MzFiOSwgMjAyMS8wOS8wOS0wMDozNzozOCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMS0xMi0xM1QwNzoxNzoyOSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0xMi0xM1QwNzoxNzoyOSswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjEtMTItMTNUMDc6MTc6MjkrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmNmN2U5MjFjLTZjZTEtMzk0Yy1hNmU4LWIzZjA0NmRmOWJkMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpjZjdlOTIxYy02Y2UxLTM5NGMtYTZlOC1iM2YwNDZkZjliZDAiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjZjdlOTIxYy02Y2UxLTM5NGMtYTZlOC1iM2YwNDZkZjliZDAiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmNmN2U5MjFjLTZjZTEtMzk0Yy1hNmU4LWIzZjA0NmRmOWJkMCIgc3RFdnQ6d2hlbj0iMjAyMS0xMi0xM1QwNzoxNzoyOSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIzLjAgKFdpbmRvd3MpIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pj3/j7AAAAAMSURBVAgdY/j//z8ABf4C/p/KLRMAAAAASUVORK5CYII=';
/**
 * 清除拖拉顯示元素
 * @param {DragEvent} event
 */
export function clearDragImage(event: DragEvent): void {
  if (event.dataTransfer) {
    const img = new Image();
    img.src = png1px;
    event.dataTransfer.setDragImage(img, 0, 0);
  }
}

export interface ViewportOffsetResult {
  left: number;
  top: number;
  right: number;
  bottom: number;
  rightIncludeBody: number;
  bottomIncludeBody: number;
}

export function getBoundingClientRect(element: Element): DOMRect | number {
  if (!element || !element.getBoundingClientRect) {
    return 0;
  }
  return element.getBoundingClientRect();
}

export function getViewportOffset(element: Element): ViewportOffsetResult {
  const doc = document.documentElement;
  
  const docScrollLeft = doc.scrollLeft;
  const docScrollTop = doc.scrollTop;
  const docClientLeft = doc.clientLeft;
  const docClientTop = doc.clientTop;

  const pageXOffset = window.pageXOffset;
  const pageYOffset = window.pageYOffset;
  
  const box = getBoundingClientRect(element);

  const { left: retLeft, top: rectTop, width: rectWidth, height: rectHeight } = box as DOMRect;

  const scrollLeft = (pageXOffset || docScrollLeft) - (docClientLeft || 0);
  const scrollTop = (pageYOffset || docScrollTop) - (docClientTop || 0);
  const offsetLeft = retLeft + pageXOffset;
  const offsetTop = rectTop + pageYOffset;

  const left = offsetLeft - scrollLeft;
  const top = offsetTop - scrollTop;

  const clientWidth = window.document.documentElement.clientWidth;
  const clientHeight = window.document.documentElement.clientHeight;
  return {
    left: left,
    top: top,
    right: clientWidth - rectWidth - left,
    bottom: clientHeight - rectHeight - top,
    rightIncludeBody: clientWidth - left,
    bottomIncludeBody: clientHeight - top,
  };
}

export interface TransformStyle {
  rotate?: string;
  rotateX?: string;
  rotateY?: string;
  rotateZ?: string;
  scaleX?: string;
  scaleY?: string;
  scaleZ?: string;
  skewX?: string;
  skewY?: string;
  translateX?: string;
  translateY?: string;
  translateZ?: string;
}

export function getTransformStyleString(transform: TransformStyle): string {
  return `
  ${transform.rotate === undefined ? '' : `rotate(${conditionData(transform.rotate, 0)})`}
  ${transform.rotateX === undefined ? '' : `rotateX(${conditionData(transform.rotateX, 0)})`}
  ${transform.rotateY === undefined ? '' : `rotateY(${conditionData(transform.rotateY, 0)})`}
  ${transform.rotateZ === undefined ? '' : `rotateZ(${conditionData(transform.rotateZ, 0)})`}
  ${transform.scaleX === undefined ? '' : `scaleX(${conditionData(transform.scaleX, 1)})`}
  ${transform.scaleY === undefined ? '' : `scaleY(${conditionData(transform.scaleY, 1)})`}
  ${transform.scaleZ === undefined ? '' : `scaleZ(${conditionData(transform.scaleZ, 1)})`}
  ${transform.skewX === undefined ? '' : `skewX(${conditionData(transform.skewX, 0)})`}
  ${transform.skewY === undefined ? '' : `skewY(${conditionData(transform.skewY, 0)})`}
  ${transform.translateX === undefined ? '' : `translateX(${conditionData(transform.translateX, 0)})`}
  ${transform.translateY === undefined ? '' : `translateY(${conditionData(transform.translateY, 0)})`}
  ${transform.translateZ === undefined ? '' : `translateZ(${conditionData(transform.translateZ, 0)})`}
  `;
}
