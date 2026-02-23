import router from '@/router';

export function navigateToPath(path: string) {
  router.push(path);
}

export function navigateToCourse(courseCode: string) {
  navigateToPath(`/course/${courseCode}`);
}

export function navigateToProgramme(programmeCode: string) {
  navigateToPath(`/programme/${programmeCode}`);
}

export function navigateToSchool(schoolCode: string) {
  navigateToPath(`/school/${schoolCode}`);
}

export function navigateToParent() {
  router.go(-1);
}
