export const sortName = (name1: string, name2: string) => {
  const nameA = name1.toLowerCase();
  const nameB = name2.toLowerCase();

  const firstNameA = nameA.slice(0, nameA.indexOf(' '));
  const middleNameA = nameA.slice(
    nameA.indexOf(' ') + 1,
    nameA.lastIndexOf(' ')
  );
  const lastNameA = nameA.slice(nameA.lastIndexOf(' ') + 1);

  const lastNameB = nameB.slice(nameB.lastIndexOf(' ') + 1);
  const middleNameB = nameB.slice(
    nameB.indexOf(' ') + 1,
    nameB.lastIndexOf(' ')
  );
  const firstNameB = nameB.slice(0, nameB.indexOf(' '));

  if (lastNameA < lastNameB) {
    return -1;
  } else if (lastNameA > lastNameB) {
    return 1;
  } else {
    if (middleNameA < middleNameB) {
      return -1;
    } else if (middleNameA > middleNameB) {
      return 1;
    } else {
      if (firstNameA < firstNameB) {
        return -1;
      } else if (firstNameA > firstNameB) {
        return 1;
      } else {
        return 0;
      }
    }
  }
};
