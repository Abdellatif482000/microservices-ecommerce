export const getCookisValue = (req: any, res: any) => {
  const cookieHeader = req.header("cookie");

  // Initialize an empty object to store cookies
  let cookiesParsed: Record<string, string> = {};

  // If cookie header exists, process it
  if (cookieHeader) {
    // Split the cookie string by semicolons and iterate over each cookie
    const cookiesArray = cookieHeader.split(";");
    cookiesArray.forEach((cookie: any) => {
      // Split each cookie by '=' to get the key and value
      const [key, value] = cookie.trim().split("=");

      if (key && value) {
        cookiesParsed[key] = decodeURIComponent(value); // Decode the value
      }
    });

    console.log(cookiesParsed); // Output the parsed cookies
  } else {
    console.log("No cookies found");
  }
};
