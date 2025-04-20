
export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterCategory {
  id: string;
  name: string;
  options: FilterOption[];
}

const filterCategories: FilterCategory[] = [
  {
    id: 'schools',
    name: 'Schools',
    options: [
      { id: 'harvard', label: 'Harvard' },
      { id: 'stanford', label: 'Stanford' },
      { id: 'yale', label: 'Yale' },
      { id: 'princeton', label: 'Princeton' },
      { id: 'mit', label: 'MIT' },
      { id: 'berkeley', label: 'Berkeley' },
      { id: 'duke', label: 'Duke' },
      { id: 'columbia', label: 'Columbia' },
      { id: 'amherst', label: 'Amherst' },
      { id: 'alabama', label: 'Alabama' }
    ]
  },
  {
    id: 'majors',
    name: 'Majors',
    options: [
      { id: 'computer-science', label: 'Computer Science' },
      { id: 'economics', label: 'Economics' },
      { id: 'business', label: 'Business' },
      { id: 'engineering', label: 'Engineering' },
      { id: 'biology', label: 'Biology' },
      { id: 'political-science', label: 'Political Science' },
      { id: 'pre-med', label: 'Pre-Med' },
      { id: 'english', label: 'English' },
      { id: 'psychology', label: 'Psychology' },
      { id: 'environmental-science', label: 'Environmental Science' }
    ]
  },
  {
    id: 'activities',
    name: 'Activities',
    options: [
      { id: 'sports', label: 'Sports' },
      { id: 'greek-life', label: 'Greek Life' },
      { id: 'research', label: 'Research' },
      { id: 'music', label: 'Music' },
      { id: 'theater', label: 'Theater' },
      { id: 'journalism', label: 'Journalism' },
      { id: 'debate', label: 'Debate' },
      { id: 'community-service', label: 'Community Service' },
      { id: 'entrepreneurship', label: 'Entrepreneurship' },
      { id: 'study-abroad', label: 'Study Abroad' }
    ]
  },
  {
    id: 'sports',
    name: 'Sports',
    options: [
      { id: 'basketball', label: 'Basketball' },
      { id: 'football', label: 'Football' },
      { id: 'soccer', label: 'Soccer' },
      { id: 'baseball', label: 'Baseball' },
      { id: 'lacrosse', label: 'Lacrosse' },
      { id: 'swimming', label: 'Swimming' },
      { id: 'tennis', label: 'Tennis' },
      { id: 'track', label: 'Track & Field' },
      { id: 'volleyball', label: 'Volleyball' },
      { id: 'rowing', label: 'Rowing' }
    ]
  }
];

export default filterCategories;
