import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { University } from "lucide-react";

const UndergraduateAdmissions = () => {
  // Array of universities to display
  const universities = [
    { id: "allegheny-college", name: "Allegheny College" },
    { id: "american-university", name: "American University" },
    { id: "amherst-college", name: "Amherst College" },
    { id: "appalachian-state-university", name: "Appalachian State University" },
    { id: "auburn-university", name: "Auburn University" },
    { id: "augustana-college-il", name: "Augustana College (IL)" },
    { id: "australian-national-university", name: "Australian National University" },
    { id: "ball-state-university", name: "Ball State University" },
    { id: "barnard-college", name: "Barnard College" },
    { id: "bates-college", name: "Bates College" },
    { id: "bentley-university", name: "Bentley University" },
    { id: "beloit-college", name: "Beloit College" },
    { id: "boise-state-university", name: "Boise State University" },
    { id: "boston-college", name: "Boston College" },
    { id: "bowdoin-college", name: "Bowdoin College" },
    { id: "brigham-young-university", name: "Brigham Young University" },
    { id: "brown-university", name: "Brown University" },
    { id: "bryn-mawr-college", name: "Bryn Mawr College" },
    { id: "butler-university", name: "Butler University" },
    { id: "california-institute-of-technology-caltech", name: "California Institute of Technology (Caltech)" },
    { id: "california-lutheran-university", name: "California Lutheran University" },
    { id: "california-polytechnic-state-university-san-luis-obispo", name: "California Polytechnic State University, San Luis Obispo" },
    { id: "california-state-university-san-marcos", name: "California State University San Marcos" },
    { id: "carleton-college", name: "Carleton College" },
    { id: "carnegie-mellon-university", name: "Carnegie Mellon University" },
    { id: "centre-college", name: "Centre College" },
    { id: "chapman-university", name: "Chapman University" },
    { id: "clark-atlanta-university", name: "Clark Atlanta University" },
    { id: "clark-university", name: "Clark University" },
    { id: "claremont-mckenna-college", name: "Claremont McKenna College" },
    { id: "clayton-state-university", name: "Clayton State University" },
    { id: "clemson-university", name: "Clemson University" },
    { id: "college-of-wooster", name: "College of Wooster" },
    { id: "colorado-college", name: "Colorado College" },
    { id: "colorado-school-of-mines", name: "Colorado School of Mines" },
    { id: "connecticut-college", name: "Connecticut College" },
    { id: "cornell-university", name: "Cornell University" },
    { id: "dartmouth-college", name: "Dartmouth College" },
    { id: "davidson-college", name: "Davidson College" },
    { id: "depaul-university", name: "DePaul University" },
    { id: "delaware-state-university", name: "Delaware State University" },
    { id: "denison-university", name: "Denison University" },
    { id: "drexel-university", name: "Drexel University" },
    { id: "duke-university", name: "Duke University" },
    { id: "east-carolina-university", name: "East Carolina University" },
    { id: "eastern-washington-university", name: "Eastern Washington University" },
    { id: "elon-university", name: "Elon University" },
    { id: "emerson-college", name: "Emerson College" },
    { id: "emory-university", name: "Emory University" },
    { id: "eth-zurich", name: "ETH Zurich" },
    { id: "fudan-university", name: "Fudan University" },
    { id: "florida-a-m-university-famu", name: "Florida A&M University (FAMU)" },
    { id: "florida-international-university", name: "Florida International University" },
    { id: "florida-state-university", name: "Florida State University" },
    { id: "fordham-university", name: "Fordham University" },
    { id: "franklin-and-marshall-college", name: "Franklin & Marshall College" },
    { id: "georgetown-university", name: "Georgetown University" },
    { id: "georgia-institute-of-technology", name: "Georgia Institute of Technology" },
    { id: "grand-valley-state-university", name: "Grand Valley State University" },
    { id: "grinnell-college", name: "Grinnell College" },
    { id: "gustavus-adolphus-college", name: "Gustavus Adolphus College" },
    { id: "hamilton-college", name: "Hamilton College" },
    { id: "hampton-university", name: "Hampton University" },
    { id: "harvard-university", name: "Harvard University" },
    { id: "harvey-mudd-college", name: "Harvey Mudd College" },
    { id: "haverford-college", name: "Haverford College" },
    { id: "heidelberg-university", name: "Heidelberg University" },
    { id: "howard-university", name: "Howard University" },
    { id: "illinois-institute-of-technology", name: "Illinois Institute of Technology" },
    { id: "indiana-university-bloomington", name: "Indiana University Bloomington" },
    { id: "ithaca-college", name: "Ithaca College" },
    { id: "james-madison-university", name: "James Madison University" },
    { id: "johns-hopkins-university", name: "Johns Hopkins University" },
    { id: "kenyon-college", name: "Kenyon College" },
    { id: "lafayette-college", name: "Lafayette College" },
    { id: "lawrence-university", name: "Lawrence University" },
    { id: "loyola-marymount-university", name: "Loyola Marymount University" },
    { id: "ludwig-maximilian-university-of-munich", name: "Ludwig Maximilian University of Munich" },
    { id: "macalester-college", name: "Macalester College" },
    { id: "marist-college", name: "Marist College" },
    { id: "massachusetts-institute-of-technology-mit", name: "Massachusetts Institute of Technology (MIT)" },
    { id: "mcgill-university", name: "McGill University" },
    { id: "miami-university-ohio", name: "Miami University (Ohio)" },
    { id: "michigan-state-university", name: "Michigan State University" },
    { id: "middlebury-college", name: "Middlebury College" },
    { id: "mississippi-state-university", name: "Mississippi State University" },
    { id: "montana-state-university", name: "Montana State University" },
    { id: "morehouse-college", name: "Morehouse College" },
    { id: "morgan-state-university", name: "Morgan State University" },
    { id: "mount-holyoke-college", name: "Mount Holyoke College" },
    { id: "national-university-of-singapore", name: "National University of Singapore" },
    { id: "new-jersey-institute-of-technology-njit", name: "New Jersey Institute of Technology (NJIT)" },
    { id: "new-york-university-nyu", name: "New York University (NYU)" },
    { id: "northern-arizona-university", name: "Northern Arizona University" },
    { id: "north-carolina-a-t-state-university", name: "North Carolina A&T State University" },
    { id: "northwestern-university", name: "Northwestern University" },
    { id: "occidental-college", name: "Occidental College" },
    { id: "ohio-state-university", name: "Ohio State University" },
    { id: "oberlin-college", name: "Oberlin College" },
    { id: "oregon-state-university", name: "Oregon State University" },
    { id: "peking-university", name: "Peking University" },
    { id: "pennsylvania-state-university", name: "Pennsylvania State University" },
    { id: "pepperdine-university", name: "Pepperdine University" },
    { id: "pomona-college", name: "Pomona College" },
    { id: "princeton-university", name: "Princeton University" },
    { id: "purdue-university", name: "Purdue University" },
    { id: "quinnipiac-university", name: "Quinnipiac University" },
    { id: "reed-college", name: "Reed College" },
    { id: "rensselaer-polytechnic-institute-rpi", name: "Rensselaer Polytechnic Institute (RPI)" },
    { id: "rhodes-college", name: "Rhodes College" },
    { id: "rice-university", name: "Rice University" },
    { id: "rose-hulman-institute-of-technology", name: "Rose-Hulman Institute of Technology" },
    { id: "rutgers-university", name: "Rutgers University" },
    { id: "sam-houston-state-university", name: "Sam Houston State University" },
    { id: "san-diego-state-university", name: "San Diego State University" },
    { id: "san-jose-state-university", name: "San Jose State University" },
    { id: "santa-clara-university", name: "Santa Clara University" },
    { id: "sarah-lawrence-college", name: "Sarah Lawrence College" },
    { id: "sciences-po", name: "Sciences Po" },
    { id: "seattle-university", name: "Seattle University" },
    { id: "seoul-national-university", name: "Seoul National University" },
    { id: "sewanee-the-university-of-the-south", name: "Sewanee: The University of the South" },
    { id: "skidmore-college", name: "Skidmore College" },
    { id: "smith-college", name: "Smith College" },
    { id: "spelman-college", name: "Spelman College" },
    { id: "st-olaf-college", name: "St. Olaf College" },
    { id: "stanford-university", name: "Stanford University" },
    { id: "stevens-institute-of-technology", name: "Stevens Institute of Technology" },
    { id: "stetson-university", name: "Stetson University" },
    { id: "suny-binghamton", name: "SUNY Binghamton" },
    { id: "suny-geneseo", name: "SUNY Geneseo" },
    { id: "suny-stony-brook", name: "SUNY Stony Brook" },
    { id: "swarthmore-college", name: "Swarthmore College" },
    { id: "texas-a-m-university", name: "Texas A&M University" },
    { id: "texas-state-university", name: "Texas State University" },
    { id: "the-new-school", name: "The New School" },
    { id: "towson-university", name: "Towson University" },
    { id: "trinity-college", name: "Trinity College" },
    { id: "trinity-college-dublin", name: "Trinity College Dublin" },
    { id: "tufts-university", name: "Tufts University" },
    { id: "tuskegee-university", name: "Tuskegee University" },
    { id: "union-college", name: "Union College" },
    { id: "university-college-london-ucl", name: "University College London (UCL)" },
    { id: "university-of-akron", name: "University of Akron" },
    { id: "university-of-alabama", name: "University of Alabama" },
    { id: "university-of-alaska-fairbanks", name: "University of Alaska Fairbanks" },
    { id: "university-of-amsterdam", name: "University of Amsterdam" },
    { id: "university-of-arizona", name: "University of Arizona" },
    { id: "university-of-arkansas", name: "University of Arkansas" },
    { id: "university-of-auckland", name: "University of Auckland" },
    { id: "university-of-barcelona", name: "University of Barcelona" },
    { id: "university-of-berkeley", name: "University of Berkeley" },
    { id: "university-of-british-columbia", name: "University of British Columbia" },
    { id: "university-of-california-berkeley", name: "University of California, Berkeley" },
    { id: "university-of-california-davis", name: "University of California, Davis" },
    { id: "university-of-california-irvine", name: "University of California, Irvine" },
    { id: "university-of-california-los-angeles-ucla", name: "University of California, Los Angeles (UCLA)" },
    { id: "university-of-california-merced", name: "University of California, Merced" },
    { id: "university-of-california-riverside", name: "University of California, Riverside" },
    { id: "university-of-california-san-diego", name: "University of California, San Diego" },
    { id: "university-of-california-san-francisco", name: "University of California, San Francisco" },
    { id: "university-of-california-santa-barbara", name: "University of California, Santa Barbara" },
    { id: "university-of-california-santa-cruz", name: "University of California, Santa Cruz" },
    { id: "university-of-cambridge", name: "University of Cambridge" },
    { id: "university-of-cape-town", name: "University of Cape Town" },
    { id: "university-of-central-florida", name: "University of Central Florida" },
    { id: "university-of-chicago", name: "University of Chicago" },
    { id: "university-of-cincinnati", name: "University of Cincinnati" },
    { id: "university-of-colorado-boulder", name: "University of Colorado Boulder" },
    { id: "university-of-copenhagen", name: "University of Copenhagen" },
    { id: "university-of-delaware", name: "University of Delaware" },
    { id: "university-of-denver", name: "University of Denver" },
    { id: "university-of-edinburgh", name: "University of Edinburgh" },
    { id: "university-of-florida", name: "University of Florida" },
    { id: "university-of-georgia", name: "University of Georgia" },
    { id: "university-of-glasgow", name: "University of Glasgow" },
    { id: "university-of-hawaii-at-manoa", name: "University of Hawaii at Manoa" },
    { id: "university-of-heidelberg", name: "University of Heidelberg" },
    { id: "university-of-helsinki", name: "University of Helsinki" },
    { id: "university-of-hong-kong", name: "University of Hong Kong" },
    { id: "university-of-idaho", name: "University of Idaho" },
    { id: "university-of-illinois-at-urbana-champaign", name: "University of Illinois at Urbana-Champaign" },
    { id: "university-of-iowa", name: "University of Iowa" },
    { id: "university-of-kansas", name: "University of Kansas" },
    { id: "university-of-kentucky", name: "University of Kentucky" },
    { id: "university-of-louisiana-at-lafayette", name: "University of Louisiana at Lafayette" },
    { id: "university-of-maine", name: "University of Maine" },
    { id: "university-of-manchester", name: "University of Manchester" },
    { id: "university-of-maryland-college-park", name: "University of Maryland, College Park" },
    { id: "university-of-massachusetts-amherst", name: "University of Massachusetts Amherst" },
    { id: "university-of-melbourne", name: "University of Melbourne" },
    { id: "university-of-michigan-ann-arbor", name: "University of Michigan, Ann Arbor" },
    { id: "university-of-minnesota-twin-cities", name: "University of Minnesota, Twin Cities" },
    { id: "university-of-mississippi", name: "University of Mississippi" },
    { id: "university-of-missouri", name: "University of Missouri" },
    { id: "university-of-montreal", name: "University of Montreal" },
    { id: "university-of-nebraska-lincoln", name: "University of Nebraska–Lincoln" },
    { id: "university-of-nevada-las-vegas", name: "University of Nevada, Las Vegas" },
    { id: "university-of-nevada-reno", name: "University of Nevada, Reno" },
    { id: "university-of-new-hampshire", name: "University of New Hampshire" },
    { id: "university-of-new-mexico", name: "University of New Mexico" },
    { id: "university-of-north-carolina-chapel-hill", name: "University of North Carolina at Chapel Hill" },
    { id: "university-of-north-carolina-wilmington", name: "University of North Carolina Wilmington" },
    { id: "university-of-north-dakota", name: "University of North Dakota" },
    { id: "university-of-northern-colorado", name: "University of Northern Colorado" },
    { id: "university-of-north-texas", name: "University of North Texas" },
    { id: "university-of-notre-dame", name: "University of Notre Dame" },
    { id: "university-of-oklahoma", name: "University of Oklahoma" },
    { id: "university-of-oregon", name: "University of Oregon" },
    { id: "university-of-oslo", name: "University of Oslo" },
    { id: "university-of-oxford", name: "University of Oxford" },
    { id: "university-of-pennsylvania", name: "University of Pennsylvania" },
    { id: "university-of-pittsburgh", name: "University of Pittsburgh" },
    { id: "university-of-portland", name: "University of Portland" },
    { id: "university-of-queensland", name: "University of Queensland" },
    { id: "university-of-rhode-island", name: "University of Rhode Island" },
    { id: "university-of-richmond", name: "University of Richmond" },
    { id: "university-of-rochester", name: "University of Rochester" },
    { id: "university-of-san-diego", name: "University of San Diego" },
    { id: "university-of-sao-paulo", name: "University of São Paulo" },
    { id: "university-of-south-carolina", name: "University of South Carolina" },
    { id: "university-of-south-dakota", name: "University of South Dakota" },
    { id: "university-of-southern-california-usc", name: "University of Southern California (USC)" },
    { id: "university-of-st-andrews", name: "University of St Andrews" },
    { id: "university-of-sydney", name: "University of Sydney" },
    { id: "university-of-tampa", name: "University of Tampa" },
    { id: "university-of-tennessee-knoxville", name: "University of Tennessee, Knoxville" },
    { id: "university-of-texas-at-austin", name: "University of Texas at Austin" },
    { id: "university-of-tokyo", name: "University of Tokyo" },
    { id: "university-of-toronto", name: "University of Toronto" },
    { id: "university-of-utah", name: "University of Utah" },
    { id: "university-of-vermont", name: "University of Vermont" },
    { id: "university-of-vienna", name: "University of Vienna" },
    { id: "university-of-virginia", name: "University of Virginia" },
    { id: "university-of-washington", name: "University of Washington" },
    { id: "university-of-wisconsin-la-crosse", name: "University of Wisconsin–La Crosse" },
    { id: "university-of-wisconsin-madison", name: "University of Wisconsin–Madison" },
    { id: "university-of-wyoming", name: "University of Wyoming" },
    { id: "vanderbilt-university", name: "Vanderbilt University" },
    { id: "vassar-college", name: "Vassar College" },
    { id: "wake-forest-university", name: "Wake Forest University" },
    { id: "washington-and-lee-university", name: "Washington and Lee University" },
    { id: "washington-state-university", name: "Washington State University" },
    { id: "washington-university-in-st-louis", name: "Washington University in St. Louis" },
    { id: "wellesley-college", name: "Wellesley College" },
    { id: "wesleyan-university", name: "Wesleyan University" },
    { id: "west-point-us-military-academy", name: "West Point (US Military Academy)" },
    { id: "western-michigan-university", name: "Western Michigan University" },
    { id: "western-washington-university", name: "Western Washington University" },
    { id: "wheaton-college", name: "Wheaton College" },
    { id: "whitman-college", name: "Whitman College" },
    { id: "williams-college", name: "Williams College" },
    { id: "worcester-polynomial"}  
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Undergraduate Admissions Insights | AlumniSights</title>
        <meta name="description" content="Learn about undergraduate admission processes and strategies" />
      </Helmet>

      <Navbar />

      <main className="container-custom py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Undergraduate Admissions Insights
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Expert advice and insights on undergraduate admissions processes at top universities
            </p>
            <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {universities.map((university) => (
              <Link
                key={university.id}
                to={`/insights/undergraduate-admissions/${university.id}`}
                className="transform transition-transform hover:scale-105 focus:outline-none"
              >
                <Card className="overflow-hidden border shadow hover:shadow-md h-full">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="bg-blue-50 rounded-full p-4 mb-3">
                      <University className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-navy">
                      {university.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UndergraduateAdmissions;
