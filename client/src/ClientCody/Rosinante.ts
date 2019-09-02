const nativeMax = Math.max;
const nativeMin = Math.min;

interface RosinanteTypes {

	scrollContainer: any;
	scrollItem: any;
	scrollTarget: any;
	once: boolean;
	visible: any;
	notVisible: any;
	throttle: number;
	responsiveBreakPoint: number;
	elementPieceSmall: number;
	elementPieceLarge: number;

};

class Rosinante {

    Rosinante: RosinanteTypes;
    debounce_c: any;
    throttle_c: any;
    throttledHeart: any;
    

    constructor({scrollContainer, scrollItem, scrollTarget, once, visible, notVisible, throttle, responsiveBreakPoint, elementPieceSmall, elementPieceLarge}: RosinanteTypes) {

	this.Rosinante = {

		scrollContainer: scrollContainer,
		scrollItem: scrollItem,
		scrollTarget: scrollTarget,
		once: once,
		visible: visible,
		notVisible: notVisible,
		throttle: throttle,
		responsiveBreakPoint: responsiveBreakPoint,
		elementPieceSmall: elementPieceSmall,
		elementPieceLarge: elementPieceLarge

	};

        // ROSINANTE

        this.callRosinante = this.callRosinante.bind(this);
	this.removeRosinante = this.removeRosinante.bind(this);

        // SCROLL EVENTS

        this.isVisible = this.isVisible.bind(this);
        this.onVisibilityChange = this.onVisibilityChange.bind(this);
        this.throttle_c = this.throttle.bind(this);
        this.debounce_c = this.debounce.bind(this);
	
	this.rosinanteHeart = this.rosinanteHeart.bind(this);

	this.throttledHeart = this.throttle(this.rosinanteHeart, throttle, {});



    }

    callRosinante() {

	this.Rosinante.scrollContainer.addEventListener("scroll", this.throttledHeart);
	
	setTimeout(() => {
        
		this.rosinanteHeart();

    	}, 1);

	

  
    }

    removeRosinante(): void {

	this.Rosinante.scrollContainer.removeEventListener("scroll", this.throttledHeart);
	

    }

    rosinanteHeart(): void {

		this.onVisibilityChange( this.Rosinante.scrollTarget, () => {

			if (this.Rosinante.once === true) {

				this.Rosinante.scrollContainer.removeEventListener("scroll", this.throttledHeart);

			}

			this.Rosinante.visible();
	

		},  () => {

			this.Rosinante.notVisible();

		});
		
    }

    isVisible(el: HTMLElement): boolean {

           let rect = el.getBoundingClientRect();
           let innHT = 0;
           let innHB = 0;

        if ((window.innerWidth || document.documentElement.clientWidth) <= this.Rosinante.responsiveBreakPoint) {

            innHT = 0;
            innHB = (window.innerHeight || document.documentElement.clientHeight) + this.Rosinante.elementPieceSmall;

        }

        if ((window.innerWidth || document.documentElement.clientWidth) > this.Rosinante.responsiveBreakPoint) {

         
            innHT = 0;
            innHB = (window.innerHeight || document.documentElement.clientHeight) +  this.Rosinante.elementPieceLarge;
   
        }

	 return (

            rect.top >= innHT &&
            rect.left >= 0 &&
            rect.bottom <= innHB && 
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) 

        );
          
                
    }

    onVisibilityChange(el: HTMLElement, callback: any, callback2: any) {

            let visible = this.isVisible(el);

            if (visible === true) {
         
                if (typeof callback == 'function') {

                    callback();

                }

            }

            if (visible === false) {

                if (typeof callback == 'function') {

                    callback2();

                }

            }

    }

	debounce(func: any, wait: number, options: any) {
        let lastArgs: any,
          lastThis: any,
          maxWait: any,
          result: any,
          timerId: any,
          lastCallTime: any,
          lastInvokeTime: any = 0,
          leading: any = false,
          maxing: any = false,
          trailing: any = true,
          FUNC_ERROR_TEXT = "NOT A FUNCTION";
        if (typeof func !== 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        wait = Number(wait) || 0;
        if (typeof options === 'object') {
          leading = !!options.leading;
          maxing = 'maxWait' in options;
          maxWait = maxing
            ? nativeMax(Number(options.maxWait) || 0, wait)
            : maxWait;
          trailing = 'trailing' in options
            ? !!options.trailing
            : trailing;
        }
      
        function invokeFunc(time: number) {
          let args = lastArgs,
            thisArg = lastThis;
      
          lastArgs = lastThis = undefined;
          lastInvokeTime = time;
          result = func.apply(thisArg, args);
          return result;
        }
      
        function leadingEdge(time: number) {
          // Reset any `maxWait` timer.
          lastInvokeTime = time;
          // Start the timer for the trailing edge.
          timerId = setTimeout(timerExpired, wait);
          // Invoke the leading edge.
          return leading
            ? invokeFunc(time)
            : result;
        }
      
        function remainingWait(time: number) {
          let timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime,
            result = wait - timeSinceLastCall;
          
          return maxing
            ? nativeMin(result, maxWait - timeSinceLastInvoke)
            : result;
        }
      
        function shouldInvoke(time: number) {
          let timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime;
          // Either this is the first call, activity has stopped and we're at the trailing
          // edge, the system time has gone backwards and we're treating it as the
          // trailing edge, or we've hit the `maxWait` limit.
          return (lastCallTime === undefined || (timeSinceLastCall >= wait) || (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
        }
      
        function timerExpired() {
          const time = Date.now();
          if (shouldInvoke(time)) {
            return trailingEdge(time);
          }
          // Restart the timer.
          timerId = setTimeout(timerExpired, remainingWait(time));
        }
      
        function trailingEdge(time: number) {
          timerId = undefined;
      
          // Only invoke if we have `lastArgs` which means `func` has been debounced at
          // least once.
          if (trailing && lastArgs) {
            return invokeFunc(time);
          }
          lastArgs = lastThis = undefined;
          return result;
        }
      
        function cancel() {
          if (timerId !== undefined) {
            clearTimeout(timerId);
          }
          lastInvokeTime = 0;
          lastArgs = lastCallTime = lastThis = timerId = undefined;
        }
      
        function flush() {
          return timerId === undefined
            ? result
            : trailingEdge(Date.now());
        }
      
        const debounced = (...arg: any[]) => {

          let time: any = Date.now(),
            isInvoking: any = shouldInvoke(time);
          lastArgs = arg;
          lastThis = this;
          lastCallTime = time;
      
          if (isInvoking) {
            if (timerId === undefined) {
              return leadingEdge(lastCallTime);
            }
            if (maxing) {
              // Handle invocations in a tight loop.
              timerId = setTimeout(timerExpired, wait);
              return invokeFunc(lastCallTime);
            }
          }
          if (timerId === undefined) {
            timerId = setTimeout(timerExpired, wait);
          }
          return result;
        }
        debounced.cancel = cancel;
        debounced.flush = flush;
        return debounced;
      }
      
  throttle(func: any, wait: number, options: any) {


        let leading = true,
          trailing = true,
          FUNC_ERROR_TEXT = "NOT A FUNCTION";
      
        if (typeof func !== 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        if (typeof options === 'object') {
          leading = 'leading' in options
            ? !!options.leading
            : leading;
          trailing = 'trailing' in options
            ? !!options.trailing
            : trailing;
        }
        return this.debounce(func, wait, {
          leading,
          maxWait: wait,
          trailing,
        });
      }

}

export default Rosinante;
