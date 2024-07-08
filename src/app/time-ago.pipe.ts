import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  pure: false // Mark the pipe as impure to update the view periodically
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: Date | any): string {
    if (!value) return 'Invalid date';

    const currentDate = new Date();
    const postDate = new Date(value);

    // Ensure postDate is not in the future
    if (postDate > currentDate) return 'Just now';

    const timeDifference = currentDate.getTime() - postDate.getTime();

    const minutes = Math.floor(timeDifference / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (minutes < 1) {
      return 'Just now';
    } else if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (hours < 24) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (days < 30) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (months < 12) {
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
  }
}
