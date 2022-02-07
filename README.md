# Weather-Dashboard

For this assignment, I was tasked with creating a weather application which uses OpenWeather API to search for current weather status, and weather forecast of certain places based on user input. I did this utilizing multiple different functions which either dynamically created elements, fetched data, or made loops in order to sift through data, and produce the intended outcome. Upon loading the runs through a sequence to check local storage, and if there is data resent which matches queries id, then that data is pulled to the application and presented to the user. If no data is found, the application waits for the user to input a location in order to search for data. If either no data is given, or an incorrect answer is given, the system alerts the user, and resets the search query data. When a valid search is given, the web application presents the current data, and a 5 day forecast for the location searched, and add the searched location to search history. This continues on, for each place searched. However, the local storage will only save and display 8 searches upon reloading the website, that way the website doesn't stay cluttered.

![Screenshot #1](https://github.com/mkelsch2000/Weather-Dashboard/blob/main/assets/images/snip-1.png)
![Screenshot #2](https://github.com/mkelsch2000/Weather-Dashboard/blob/main/assets/images/snip-2.png)
![Screenshot #3](https://github.com/mkelsch2000/Weather-Dashboard/blob/main/assets/images/snip-3.png)

Deployed Application: https://mkelsch2000.github.io/Weather-Dashboard/