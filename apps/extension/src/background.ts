/* eslint-disable @typescript-eslint/no-explicit-any */
console.log("Background loading...");

const CONNECTION_URL =
  "https://www.linkedin.com/voyager/api/relationships/dash/connections?decorationId=com.linkedin.voyager.dash.deco.web.mynetwork.ConnectionListWithProfile-16&count=40&q=search&sortType=RECENTLY_ADDED";

const OWNER_USER_INFO_URL = "https://www.linkedin.com/voyager/api/graphql?variables=(vanityName:identifier)&queryId=voyagerIdentityDashProfiles.ee32334d3bd69a1900a077b5451c646a"




let start = 0;
const allConnections: UserInfo[] = [];
// let ownerUserInfo = null;
let ownerPublicIdentifier: string | null = null;

type UserInfo = {
  entityUrn: string;
  firstName: string;
  lastName: string;
  headline: string;
  publicIdentifier: string;
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "saveProfile") {
    const publicIdentifier = message.data.href.split('/in/')[1]?.split('/')[0] || '';
    ownerPublicIdentifier = publicIdentifier;
  }
});


const getCookies = async () => {
  return chrome.cookies.getAll({
    domain: "linkedin.com",
  });
};

export const getCookie = async (): Promise<string | null> => {
  try {
    const cookies = await getCookies();
    const cookieString = cookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");
    return cookieString;
  } catch (error) {
    console.error(`Error getting cookie`, error);
    throw error;
  }
};

export const getCsrfToken = async (): Promise<string | null> => {
  try {
    const cookie = await chrome.cookies.get({
      url: "https://www.linkedin.com",
      name: "JSESSIONID",
    });
    if (!cookie) {
      console.error("JSESSIONID cookie not found");
      return null;
    }
    const token = cookie.value.replace(/^"|"$/g, "");
    return token;
  } catch (error) {
    console.error("Error getting CSRF token:", error);
    throw error;
  }
};

const fetchConnectionsBatch = async (start: number) => {
  const cookie = await getCookie();
  const csrfToken = await getCsrfToken();


  const url = `${CONNECTION_URL}&start=${start}`;

  return fetch(url, {
    method: "GET",
    headers: {
      "Cookie": cookie!,
      "Csrf-Token": csrfToken!,
      "Accept": "application/vnd.linkedin.normalized+json+2.1",
      "X-Restli-Protocol-Version": "2.0.0",
      "Content-Type": "application/json",
    }
  });
};

const parseConnections = (data: any): UserInfo[] => {
  // Get profiles from the response
  const allProfiles = data.included.filter((item: any) => {
    return (
      item.entityUrn.includes("urn:li:fsd_profile")
    );
  });

  // Map each profile to the fields for UserInfo entity
  const connections: UserInfo[] = allProfiles.map((profile: UserInfo) => {
    return {
      entityUrn: profile.entityUrn,
      firstName: profile.firstName,
      lastName: profile.lastName,
      headline: profile.headline,
      profileUrl: "https://www.linkedin.com/in/" + profile.publicIdentifier,
    };
  });

  return connections;
};

export const fetchConnections = async () => {
   while (true) {
    const response = await fetchConnectionsBatch(start);
    const data = await response.json();

    if (!data.included || data.included.length === 0) {
      break;
    }

    const batchConnections = parseConnections(data);

    batchConnections.forEach((conn) => {
      if (!allConnections.some((c) => c.entityUrn === conn.entityUrn)) {
        allConnections.push(conn);
      }
    });

    start += 40;
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  console.log("All Connections:", allConnections);
};

const pushConnectionsToServer = async (connections: UserInfo[]) => {
  try {
    await fetch("http://localhost:3000/api/connections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ connections }),
    });
    console.log("Connections pushed to server");
  } catch (error) {
    console.error("Error pushing connections to server:", error);
  }
}

const fetchOwnerUserInfo = async () => {
  const cookie = await getCookie();
  const csrfToken = await getCsrfToken();

  const url = OWNER_USER_INFO_URL.replace("identifier", ownerPublicIdentifier!);


  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Cookie": cookie!,
      "Csrf-Token": csrfToken!,
      "Accept": "application/vnd.linkedin.normalized+json+2.1",
      "X-Restli-Protocol-Version": "2.0.0",
    }
  });

  const data = await response.json();
  console.log("Owner User Info:", data);
}




chrome.runtime.onInstalled.addListener(async () => {
  await fetchOwnerUserInfo();
  await fetchConnections()
  .then(async () => {
    await pushConnectionsToServer(allConnections);
  })
  .catch((error) => {
    console.error("Error fetching connections:", error);
  });
});
