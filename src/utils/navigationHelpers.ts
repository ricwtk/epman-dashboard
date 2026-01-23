import router from '@/router';

export function navigateToPath(path: string) {
  router.push(path);
}

export function navigateToCourse(courseCode: string) {
  navigateToPath(`/course/${courseCode}`);
}
