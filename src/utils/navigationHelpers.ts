export function navigateToPath(path: string) {
  window.location.href = path;
}

export function navigateToCourse(courseCode: string) {
  navigateToPath(`/course/${courseCode}`);
}
