const SHELVES = {
  currentlyReading: 'currentlyReading',
  wantToRead: 'wantToRead',
  read: 'read',
};

export default (quantity = 1, shelf = SHELVES.read) => {
  const range = [...Array(quantity)];

  return range.map((value, index) => ({
    authors: [`Authors ${index}`],
    id: `${index}`,
    imageLinks: {
      smallThumbnail: `thumbnail${index}.jpeg`,
      thumbnail: `thumbnail${index}.jpeg`,
    },
    shelf,
    title: `Title ${index}`,
  }));
};
