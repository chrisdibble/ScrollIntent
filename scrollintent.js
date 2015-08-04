//The MIT License (MIT)
//
//Copyright (c) 2015 Chris Dibble
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//    The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.
//
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.

function ScrollIntent(outerElement, onBigScroll, onSmallScroll, horizontalModifier, verticalModifier) {
    var elementDimensions = {
        elementHeight: parseInt(outerElement.offsetHeight),
        elementWidth: parseInt(outerElement.offsetWidth)
    }, previousScrollDetails = {
        scrollTopPosition: 0,
        scrollLeftPosition: 0
    };

    // setup common thresholds to determine scroll level
    horizontalModifier = horizontalModifier || 4;
    verticalModifier = verticalModifier || 2;

    (function init() {
        outerElement.addEventListener('scroll', onScroll);
    })();

    function onScroll() {
        var scrollingDown,
            newScrollTopPosition = this.scrollTop,
            newScrollLeftPosition = this.scrollLeft,
            verticalScroll = newScrollTopPosition !== previousScrollDetails.scrollTopPosition;

        if (verticalScroll) {
            scrollingDown = newScrollTopPosition > previousScrollDetails.scrollTopPosition;

            if (scrollingDown) {
                processScrollDown(newScrollTopPosition);
            } else {
                processScrollUp(newScrollTopPosition);
            }
        } else {
            var scrollingRight = newScrollLeftPosition > previousScrollDetails.scrollLeftPosition;

            if (scrollingRight) {
                processScrollRight(newScrollLeftPosition);
            } else {
                processScrollLeft(newScrollLeftPosition);
            }
        }

        previousScrollDetails.scrollTopPosition = newScrollTopPosition;
        previousScrollDetails.scrollLeftPosition = newScrollLeftPosition;
    }

    function processScrollDown(scrollTopPosition) {
        if (scrollTopPosition - previousScrollDetails.scrollTopPosition >= (elementDimensions.elementHeight * verticalModifier)) {
            onBigScroll("down");
        } else {
            onSmallScroll("down");
        }
    }

    function processScrollUp(scrollTopPosition) {
        if (previousScrollDetails.scrollTopPosition - scrollTopPosition >= (elementDimensions.elementHeight * verticalModifier)) {
            onBigScroll("up");
        } else {
            onSmallScroll("up");
        }
    }

    function processScrollRight(scrollLeftPosition) {
        if (scrollLeftPosition - previousScrollDetails.scrollLeftPosition >= (elementDimensions.elementWidth / horizontalModifier)) {
            onBigScroll("left");
        } else {
            onSmallScroll("left");
        }
    }

    function processScrollLeft(scrollLeftPosition) {
        if (previousScrollDetails.scrollLeftPosition - scrollLeftPosition >= (elementDimensions.elementWidth / horizontalModifier)) {
            onBigScroll("right");
        } else {
            onSmallScroll("right");
        }
    }

    function destroy() {
        outerElement.removeEventListener('scroll', onScroll);
    }

    function setElementSize(width, height) {
        elementDimensions.elementWidth = width;
        elementDimensions.elementHeight = height;
    }

    return {
        destroy: destroy,
        onScroll: onScroll,
        setElementSize: setElementSize
    }
}