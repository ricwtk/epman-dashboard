export interface UserProfile {
  uid: string;
  email: string;
  name: string;

  /**
   * Access Level for Data Administration
   * 1: Read Only (All)
   * 2: Edit Courses
   * 3: Edit Programmes/Structures
   * 4: Edit Schools
   */
  datalevel: number;

  /**
   * Access Level for User Administration
   * 1: Read Only (All), Edit Own Profile
   * 2: Edit User
   * 3: Create New User
   * 4: Delete User
   */
  userlevel: number;

  createdAt: Date;
  lastLogin?: Date;
}
