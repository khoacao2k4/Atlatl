const listOfAdvisers = [
    {
        id: "rossfe", 
        name: "Ross Fedenia", 
        title: "Founder and CEO", 
        certifications: ["CFP"], 
        image_url: "images/ross.webp", 
        description: "Ross founded Atlatl Advisers and serves as the CEO as well as a Wealth Adviser, particularly with the team’s high net worth clients. Ross began his career in finance as an analyst at a hedge fund before specializing in Private Wealth Management. After attending the University of Chicago, Ross furthered his education at the University of Wisconsin and became the first graduate from the Wealth Management and Financial Planning Program, which his father, Mark Fedenia, Ph.D. founded. With his progressive vision and strategic direction, Ross is an innovative leader of the group. When away from the office, Ross enjoys spending time outdoors with his wife, Emily. As a former collegiate soccer player, he remains active both as a player and a member of the local community."
    }, 
    {
        id: "markfe", 
        name: "Mark Fedenia", 
        title: "Director of Investments", 
        certifications: ["PH.D"], 
        image_url: "images/mark.jpg", 
        description: "Mark serves as the Director of Investments for Atlatl Advisers. Mark is the Baird Professor of Finance and Director of the Wealth Management & Financial Planning Program in the Wisconsin School of Business. His research and teaching interests include investment management, wealth management & financial planning. For more than two decades he was the director of the UW Madison Applied Security Analysis Program (ASAP).\nMark earned his Ph.D. from the University of Wisconsin-Madison. He is associate editor of the Financial Planning Review, the flagship publication of the CFP Board. In his role with ASAP, Mark managed equity and fixed income portfolios for the UW-Madison Foundation and UW-System. For many years, Mark was a consultant to the UW-System where he selected outside investment managers and wrote investment policies. In addition, he co-managed an alternative asset portfolio, a fund of funds, and a long-short equity fund between 2000 and 2012. Since 2015 he founded his own registered investment advisory firm which, after joining forces with the remainder of the team developed into Atlatl Advisers."
    }, 
    {
        id: "stepka", 
        name: "Stephania Kaminski", 
        title: "Director of Operations", 
        certifications: [], 
        image_url: "images/Steph1.jpg",
        description: "Stephanie is integral to the success of Atlatl Advisers. As a cofounder, Stephanie serves as the Director of Operations, managing and executing the needs of our clients. She began her career in 2010 with UBS and developed a wealth of knowledge that has led to her success today. While her experience in the industry is second to none, above all else, she enjoys developing and maintaining relationships with clients. Stephanie received a B.B.A. in finance from UW-Whitewater where she studied finance and accounting. Away from the office, if Stephanie is is not traveling you may see her on a waterski, snowmobile, or competing in a triathlon. She is also active in the community through her volunteer work at Habitat for Humanity."
    }, 
    {
        id: "huntklwe", 
        name: "Hunter Klus Dewel", 
        title: "Wealth Advisor", 
        certifications: [], 
        image_url: "images/Hunter2-1-600x840.jpg", 
        description: "Hunter began her career in the financial services industry in 2021 at Edward Jones, where she developed a strong foundation in client relationship management and financial planning. She joined Atlatl Advisers in 2022 as a Wealth Adviser.\n​She earned her degree in Finance and Economics from the University of Wisconsin - Eau Claire and has since dedicated herself to both professional growth and community involvement. Passionate about fostering meaningful connections, Hunter serves as a board member and Co-Chair of Membership for Wisconsin Commercial Real Estate Women (WCREW) and is an active member of Downtown Madison Inc.\n​Beyond her career, Hunter enjoys outdoor activities such as spending time on the WI River with her family, pheasant hunting, and long walks. She is also deeply committed to animal welfare, fostering dogs in need and participants in their transports."
    },
    {
        id: "cyntfa", 
        name: "Cynthia Farnsworth", 
        title: "Director of Investments", 
        certifications: ["CFP", "CRPS", "APMA"], 
        image_url: "images/Cindy-BW-1-1-600x840.jpg",
        description: "Cynthia is a distinguished CERTIFIED FINANCIAL PLANNER™ practitioner that underscores her commitment to excellence in personal financial planning. She is also recognized as a Chartered Retirement Plans Specialist™ and an Accredited Portfolio Management Advisor™, illustrating her expertise in retirement and investment planning. Her professional journey includes significant roles at UBS Financial Services, First Horizon National, and Ameriprise Financial, reflecting over 16 years of industry experience.\nDeeply involved in her community, Cynthia contributes to the Habitat for Humanity of Dane County and supports the Foundation for Fighting Blindness through the Vision Walk. Additionally, she is a member of TEMPO Madison, an organization that champions the influence of women in business and beyond."
    }, 
    {
        id: "jaspva", 
        name: "Jasper Vaccaro", 
        title: "Wealth Adviser", 
        certifications: ["J.D."], 
        image_url: "images/JasperVaccaro_print-1166-by-1633-600x840.jpg",
        description: "Jasper Vaccaro joined Atlatl Advisers in December of 2023 as a Wealth Adviser.  Prior to joining Atlatl Advisers, Jasper served as Senior Vice President and Managing Director of Prairie Trust.  He has over 25 years of trust and wealth management experience in addition to 11 years of legal expertise.  Jasper was regional manager for Heartland Financial USA, Inc. where he oversaw wealth management services for Wisconsin Bank & Trust, Illinois Bank & Trust, Minnesota Bank & Trust and Blue Valley Bank & Trust in Kansas City. He also served as Vice President at BMO Private Bank where he managed personal trust relationships servicing high net worth and ultra-high net worth families.\nJasper earned his Juris Doctor degree from The John Marshall Law School in Chicago, Illinois and his Bachelors of Business Administration degree in accounting from Chapman College in Orange, California. He and his family currently reside in Waunakee and he is active in the community where he has served on several board of directors, which included a term as President or Chair for Ronald McDonald House Charities of Madison, YMCA of Dane County and Community Action, Inc. of Rock and Walworth Counties."
    }, 
    {
        id: "marypa", 
        name: "Mary Patch", 
        title: "Retirement Plan Adviser", 
        certifications: ["QKA", "CPFA"],
        image_url: "images/Mary12-600x841.jpg",
        description: "Mary serves as the Retirement Plan Adviser at Atlatl Advisers.  She assists advisers, consultants, and plan sponsors in assessing and enhancing retirement plans.  Mary’s professional background spans more than three decades and includes the following specialties:\n-Vendor reviews and management\n-Request For Proposals\n-Plan design review and implementation\n-Compliance testing and analysis\n-Fiduciary consulting, oversight, and liability\n-ERISA §3(21) and §3(38) fiduciary duties\n-ERISA §3(21) and §3(38) fiduciary duties\nShe has achieved the Qualified 401(k) Administrator (QKA) and Certified Plan Fiduciary Adviser (CPFA) designations through the American Society of Pension Professionals & Actuaries (ASPPA).  Mary also holds a Series 65 license.  Mary is a published author and the Chair of ASPPA’s Plan Consultant Magazine. She was also named on National Association of Plan Advisors’ (NAPA) list of Top Women Advisors as an MVP in 2015 and an All-Star in 2016 and 2020."
    }, 
    {
        id: "timpr", 
        name: "Tim Price", 
        title: "Investment Strategist", 
        certifications: ["CFA"],
        image_url: "images/Tim1-600x840.jpg",
        description: "Tim Price serves as a portfolio manager and partner with our digital assets and blockchain technology division. Prior to his involvement with Atlatl, Tim was Principal of RiverRock Investors, a consulting firm specializing in algorithmic investing models. His past experiences also have included senior positions in 2 start-up quant funds, CIO for a $1 billion RIA, and financial analyst for a boutique private equity firm. Tim has earned a MBA from the University of Wisconsin and also is a CFA charter holder. Tim and his wife Cara enjoy spending their free time at their Montana cabin exploring the greater Yellowstone ecosystem preferably with a fly rod in his right hand and a trout coming to the net in the left."
    }, 
    {
        id: "sentsu", 
        name: "Senthil Sundaram", 
        title: "Director of Systematic Investments", 
        certifications: ["PH.D"], 
        image_url: "images/senthil-bw-2-600x838.webp",
        description: "Senthil Sundaram is a distinguished figure in the world of finance and technology, with a career that spans over 25 years. After earning his PhD in Physics from the University of Wisconsin—Madison in 1994, Senthil transitioned to Wall Street, joining a wave of scientists who were instrumental in the evolution of quantitative finance. His career includes significant tenures at some of the largest and most successful hedge funds, most notably at Two Sigma Investments, where he advanced to the role of Chief Risk Officer, overseeing the risk management of a $60 billion portfolio.\nSenthil’s expertise lies in algorithmic trading strategies, leveraging data science and machine learning methods to manage portfolios across equities, commodities, and fixed income. In recent years, he returned to Madison, WI, where he has embarked on entrepreneurial ventures that bridge his scientific background with his deep knowledge of machine learning and artificial intelligence.\nAs the founder of Lyra Finance and Lyra AI, Senthil is at the forefront of developing systematic investment strategies and incubating AI-driven companies. Through a joint venture between Lyra and Atlatl Advisers, Senthil is focused on pioneering innovative financial strategies that harness the power of AI to deliver exceptional outcomes for clients. His work represents the cutting edge of the AI revolution in finance and select scientific and engineering disciplines."
    }, 
    {
        id: "tryssm", 
        name: "Trystan Smith", 
        title: "Systematic Investment Strategiest", 
        certifications: ["MS"], 
        image_url: "images/TRYSTANSMITH.png", 
        description: "Trystan Smith combines a unique blend of expertise in physics, computer science, and finance to drive innovation in financial modeling and strategy. He holds a Bachelor of Science in Physics and a Bachelor of Business Administration in Finance from the University of Washington, as well as a Master of Science in Physics with a focus on Quantum Computing from the University of Wisconsin—Madison.\nTrystan’s academic and research pursuits in quantum computing and artificial intelligence have equipped him with cutting-edge skills in machine learning, advanced programming, and scientific computing. His deep understanding of these technologies, paired with a strong financial intuition, allows him to develop and implement groundbreaking financial strategies.\nIn collaboration with Lyra Finance and Atlatl Advisers, Trystan leverages his technical prowess to create innovative solutions that harness the power of advanced technologies, delivering exceptional outcomes for clients. His work is at the forefront of integrating quantum computing into the financial sector, pushing the boundaries of what’s possible in financial strategy and modeling."
    }, 
    {
        id: "jakewe", 
        name: "Jake Wedvick", 
        title: "Wealth Management Associate", 
        certifications: [], 
        image_url: "images/jake-wedvick.jpg", 
        description: "Jake is a Wealth Management Associate who supports the advisery team in delivering a seamless client experience across all aspects of the planning and investment process. He assists with the onboarding of new clients, account maintenance, and ongoing service needs, ensuring every relationship begins with a strong foundation and continues with personalized attention.\nJake graduated from the University of Wisconsin–Whitewater with a degree in Finance, where he developed a strong foundation in investment strategy and financial planning. His detail-oriented approach and commitment to service make him a valuable resource for both clients and colleagues.\nOutside of work, Jake enjoys staying active and spends his free time playing a variety of sports, bringing the same energy and teamwork to his personal pursuits as he does to his professional role."
    }, 
    {
        id: "ravika", 
        name: "Ravi Kaza", 
        title: "Strategy Partner", 
        certifications: [], 
        image_url: "images/Ravi-BW-600x840.jpg",
        description: "Ravi Kaza graduated from The Wharton School/University of Pennsylvania with a BS in Finance Summa Cum Laude at age 19.\nSince then, Ravi has spent the last 25 years consistently focused on disruptive technologies. Ravi started his career in Silicon Valley at a prominent investment banking group founded by Frank Quattrone and George Boutros, where he worked on numerous notable transactions for clients such as Amazon, Netscape, Apple, Lucent, and Lam Research.\nRavi entered the money management as a Vice President at Pequot Capital Management, one of the world’s largest alternative asset managers with a prominent focus on technology long/short investing at the time. Ravi oversaw the efforts within Pequot centered on the convergence of the Internet with several more traditional sectors such as retail, media, and finance. Ravi was then hired by Stanley Druckenmiller to be Managing Director at Duquesne Capital Management with primary investment responsibilities centered around long/short equity strategies in the technology sector.\nIn 2003, Ravi founded Seasons Capital Management, a multi-billion-dollar SEC-registered investment manager which oversaw multiple TMT strategies. In 2010, Ravi shifted his focus to running solely internal capital with a continued primary focus on disruptive technologies (Twitter, Uber, Digital/Blockchain assets). His focus on crypto/digital assets has grown significantly in recent years: Bitcoin in 2014, Ethereum in 2016, Early-stage crypto venture funds in 2017, and venture deals centered around the digital asset ecosystem in 2018. As of summer 2020, digital asset related investments (liquid and illiquid) constitute more than 50% of his total portfolio exposure. Ravi has now invested directly or indirectly in over 100 digital asset related investments. His core investment belief is that a disproportionate share of risk-adjusted alpha in the world during the next decade will come from the digital asset sector. Consistent with this belief, Ravi has been spending upwards of 75% of his time focused on digital asset investing."
    }
];

export default async function fetchAdvisers() {
    return listOfAdvisers; 
}

export async function fetchAdvisersById(id) {
  for (let i = 0; i < listOfAdvisers.length; ++i) {
    if (listOfAdvisers[i].id === id) {
        return listOfAdvisers[i]; 
    }
  }
  return null; 
}