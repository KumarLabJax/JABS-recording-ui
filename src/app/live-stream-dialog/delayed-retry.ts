import { Observable, throwError, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

/**
 * this is for use with the retryWith() rxjs operator so we can retry a maximum number of times
 * with a delay between each attempt
 *
 * @param maxRetryAttempts - maximum number of times to try
 * @param delay - delay between attempts (in milliseconds)
 */
export const retryStrategy = (
  {
    maxRetryAttempts = 3,
    delay = 1000
  }
  : {
    maxRetryAttempts?: number,
    delay?: number
  } = {}) => (attempts: Observable<any>) => {
  return attempts.pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1;
      // if maximum number of retries have been met
      if (retryAttempt > maxRetryAttempts) {
        return throwError(error);
      }
      console.log(
        `Live stream not ready (attempt ${retryAttempt}): retrying in ${delay}ms`
      );
      return timer(delay);
    })
  );
};
