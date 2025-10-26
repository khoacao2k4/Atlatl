import { getFeaturedTeamMembers } from "@/lib/strapi";

export default async function HomeTeam() {
  const teamMembers = await getFeaturedTeamMembers();

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col justify-center items-center w-full font-work-sans bg-dark-blue text-white text-center">
        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold font-songer pt-12">
          PEOPLE WITH A PURPOSE
        </h1>
        <p className="text-lg px-[20%] py-12">
          We strive to hire, inspire, and invest in the best talent across our
          respective disciplines and empower our team to thrive in an
          environment of respect. Our ability to celebrate different
          perspectives and foster a culture of inclusion leads to an exceptional
          client experience.
        </p>
      </div>
      <div className="w-full flex flex-col lg:flex-row items-center lg:items-start lg:justify-between px-6 lg:px-[15%] gap-12 lg:gap-8 bg-gradient-to-b from-dark-blue from-50% to-white to-50% text-text-light-blue">
        {teamMembers.map((teamMember) => {
          const imageUrl = teamMember.photo.url;
          const fullImageUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${imageUrl}` : "localhost:1337" + imageUrl;
          return (
            <div
              key={teamMember.id}
              className="flex flex-col items-center font-work-sans text-center lg:w-[30%]"
            >
              <img
                src={fullImageUrl}
                className="h-[220px] sm:h-[260px] lg:h-[300px] object-cover mb-4"
                alt={teamMember.name}
              />
              <h2 className="font-songer text-lg font-bold">
                {teamMember.name}
              </h2>
              <div>{teamMember.role}</div>
            </div>
          )
        })}
        {/* <div className="flex flex-col items-center font-work-sans text-center lg:w-[30%]">
          <img
            src="images/placeholder-vertical.png"
            className="h-[220px] sm:h-[260px] lg:h-[300px] object-cover mb-4"
            alt="Ross Fedenia"
          />
          <h2 className="font-songer text-lg font-bold">ROSS FEDENIA, CFP</h2>
          <div>Founder and CEO</div>
        </div>

        <div className="flex flex-col items-center font-work-sans text-center lg:w-[30%]">
          <img
            src="images/placeholder-vertical.png"
            className="h-[220px] sm:h-[260px] lg:h-[300px] object-cover mb-4"
            alt="Mark Fedenia"
          />
          <h2 className="font-songer text-lg font-bold">MARK FEDENIA, PH.D</h2>
          <div>Director of Investments</div>
        </div>

        <div className="flex flex-col items-center font-work-sans text-center lg:w-[30%]">
          <img
            src="images/placeholder-vertical.png"
            className="h-[220px] sm:h-[260px] lg:h-[300px] object-cover mb-4"
            alt="Stephanie Kaminski"
          ></img>
          <h2 className="font-songer text-lg font-bold">STEPHANIE KAMINSKI</h2>
          <div>Director of Operations</div>
        </div> */}
      </div>

      <button
        className="font-songer text-white bg-bold-blue rounded-full py-1.5 px-8 my-[50px] cursor-pointer "
      >
        VIEW MORE TEAM MEMBERS
      </button>
    </div>
  );
}
