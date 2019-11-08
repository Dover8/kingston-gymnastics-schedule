jQuery(document).ready(function(){
    moment.locale('en', {
      week: { dow: 1 } // Monday is the first day of the week
    });

  //Initialize the datePicker(I have taken format as mm-dd-yyyy, you can     //have your owh)
  $("#datepicker").datetimepicker({
      format: 'DD-MM-YYYY'
  });

   //Get the value of Start and End of Week
  $('#datepicker').on('dp.change', function (e) {
      var value = $("#datepicker").val();
      //need to store the date value as YYYY-MM-DD for the google calendar plugin
      var firstDate = moment(value, "DD-MM-YYYY").day(1).format("YYYY-MM-DD");
      var lastDate =  moment(value, "DD-MM-YYYY").day(7).format("YYYY-MM-DD");
      //but render it as DD-MM-YYYY
      var firstLabel = moment(value, "DD-MM-YYYY").day(1).format("DD-MM-YYYY");
      var lastLabel =  moment(value, "DD-MM-YYYY").day(7).format("DD-MM-YYYY");
      $("#datepicker").val(firstLabel + " - " + lastLabel);
      
      //call our calendar script
      init({
                calendarUrl: 'https://www.googleapis.com/calendar/v3/calendars/kingstongymnastics.org_7nh2823r0dllga1ubh0h6cscoo%40group.calendar.google.com/events?singleEvents=true&key=AIzaSyA-8SoMmPo6oXfuuioyhbxS1TS4p3nDWMY',
                past: true,
                upcoming: true,
                sameDayTimes: true,
                dayNames: true,
                recurringEvents: true,
                itemsTagName: 'li class="events-group"',
                format: ['*date*', ': ', '*summary*'],
                timeMin: firstDate+'T07:00:00-07:00',
                timeMax: lastDate+'T22:00:00-07:00'
                });
  });
    
    
    'use strict';

    var config;

    const renderList = (data, settings) => {
        var result = [];

        //Remove cancelled events, sort by date
        result = data.items.filter(item => item && item.hasOwnProperty('status') && item.status !== 'cancelled').sort(comp).reverse();
        
        var dailyResults = [],
            dailyElem = [],
            i;

        // first clear existing list
        }
        
        
        for (i in result) {
            //day check
            var day = getDayNameFormatted(getDateInfo(result[i].start.dateTime));
            }
            
        }
        
        //remove the loaded class
        Util.removeClass(main.element, 'js-schedule-loaded');
        //and reinitialise the schedule
        main.initSchedule();
    };

    //Gets JSON from Google Calendar and transfroms it into html list items and appends it to past or upcoming events list
    const init = (settings) => {
        config = settings;

        var finalURL = settings.calendarUrl;

        if (settings.recurringEvents) {
            finalURL = finalURL.concat('&singleEvents=true&orderBy=starttime');
        }

        if (settings.timeMin) {
            finalURL = finalURL.concat('&timeMin=' + settings.timeMin);
        };
        
        if (settings.timeMax) {
            finalURL = finalURL.concat('&timeMax=' + settings.timeMax);
        };

        //Get JSON, parse it, transform into list items and append it to past or upcoming events list
        var request = new XMLHttpRequest();
        request.open('GET', finalURL, true);
        
        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                var data = JSON.parse(request.responseText);
                renderList(data, settings);
            } else {
                console.error(request.onerror);
            }
        };
        
        request.onerror = () => {
            console.error(err);
        };
        
        request.send();
    };
    
    //Overwrites defaultSettings values with overrideSettings and adds overrideSettings if non existent in defaultSettings
    const mergeOptions = (defaultSettings, overrideSettings) => {
        var newObject = {},
            i;
        for (i in defaultSettings) {
            newObject[i] = defaultSettings[i];
        }
        for (i in overrideSettings) {
            newObject[i] = overrideSettings[i];
        }
        return newObject;
    };

    const isAllDay = (dateStart, dateEnd) => {
        var dateEndTemp = subtractOneDay(dateEnd);
        var isAll = true;
        
        for (var i = 0; i < 3; i++) {
            if (dateStart[i] !== dateEndTemp[i]) {
                isAll = false;
            }
        } 

        return isAll;
    };

    const isSameDay = (dateStart, dateEnd) => {
        var isSame = true;

        for (var i = 0; i < 3; i++) {
            if (dateStart[i] !== dateEnd[i]) {
                isSame = false;
            }
        } 

        return isSame;
    }
    
    //NEW format the data for the timetable layout
    const timetableListItem = (result, tagName) => {
        var dateStart = getDateInfo(result.start.dateTime || result.start.date),
            dateEnd = getDateInfo(result.end.dateTime || result.end.date),
            dayNames = config.dayNames,
            moreDaysEvent = false,
            isAllDayEvent = isAllDay(dateStart, dateEnd);
        
        if (typeof result.end.date !== 'undefined') {
            dateEnd = subtractOneDay(dateEnd);
        }

        if (!isSameDay(dateStart, dateEnd)) {
            moreDaysEvent = true;
        }
        
        var dateFormatted = getFormattedDate(dateStart, dateEnd, dayNames, moreDaysEvent, isAllDayEvent),
            output = '<li class="' + tagName + '">',
            summary = result.summary || '',
            description = result.description || 'event-0',
            //location = result.location || '',
            i;
        /* FORMAT TO THIS
        <li class="cd-schedule__event">
            <a data-start="17:30" data-end="19:30" data-content="event-adv-tumble" data-event="event-1" href="#0">
                <em class="cd-schedule__name">ADV Tumble</em>
            </a>
        </li>*/
        //format the minutes to be 00 format
        var startMinute = dateStart[4];
        startMinute = (startMinute < 10 ? '0' : '') + startMinute;
        var endMinute = dateEnd[4];
        endMinute = (endMinute < 10 ? '0' : '') + endMinute;
        
            output = output.concat('<a ');
            output = output.concat('data-start="' + dateStart[3] + ':' + startMinute + '" ');
            output = output.concat('data-end="' + dateEnd[3] + ':' + endMinute + '" ');
            output = output.concat(`data-content="${summary}" data-event="${description}" href="#0">`);
        output = output.concat(`<em class="cd-schedule__name">${summary}</em>`);
        
        return output + '</' + tagName + '>';
        
    }

    //Get all necessary data (dates, location, summary, description) and creates a list item
    const transformationList = (result, tagName, format) => {
        var dateStart = getDateInfo(result.start.dateTime || result.start.date),
            dateEnd = getDateInfo(result.end.dateTime || result.end.date),
            dayNames = config.dayNames,
            moreDaysEvent = true,
            isAllDayEvent = isAllDay(dateStart, dateEnd);

        if (typeof result.end.date !== 'undefined') {
            dateEnd = subtractOneDay(dateEnd);
        }

        if (isSameDay(dateStart, dateEnd)) {
            moreDaysEvent = false;
        }

        var dateFormatted = getFormattedDate(dateStart, dateEnd, dayNames, moreDaysEvent, isAllDayEvent),
            output = '<' + tagName + '>',
            summary = result.summary || '',
            description = result.description || '',
            location = result.location || '',
            i;

        for (i = 0; i < format.length; i++) {
            format[i] = format[i].toString();

            if (format[i] === '*summary*') {
                output = output.concat(`<span class="summary">${summary}</span>`);
            } else if (format[i] === '*date*') {
                output = output.concat(`<span class="date">${dateFormatted}</span>`);
            } else if (format[i] === '*description*') {
                output = output.concat(`<span class="description">${description}</span>`);
            } else if (format[i] === '*location*') {
                output = output.concat(`<span class="location">${location}</span>`);
            } else {
                if ((format[i + 1] === '*location*' && location !== '') ||
                    (format[i + 1] === '*summary*' && summary !== '') ||
                    (format[i + 1] === '*date*' && dateFormatted !== '') ||
                    (format[i + 1] === '*description*' && description !== '')) {

                    output = output.concat(format[i]);
                }
            }
        }

        return output + '</' + tagName + '>';
    };

    //Check if date is later then now
    const isPast = date => {
        var compareDate = new Date(date),
            now = new Date();

        if (now.getTime() > compareDate.getTime()) {
            return true;
        }

        return false;
    };

    //Get temp array with information about day in followin format: [day number, month number, year, hours, minutes]
    const getDateInfo = date => {
        date = new Date(date);
        return [date.getDate(), date.getMonth(), date.getFullYear(), date.getHours(), date.getMinutes(), 0, 0];
    };

    //Get month name according to index
    const getMonthName = month => {
        var monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ];

        return monthNames[month];
    };

    const getDayName = day => {
      var dayNames = [
          'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
      ];

      return dayNames[day];
    };

    const calculateDate = (dateInfo, amount) => {
        var date = getDateFormatted(dateInfo);
        date.setTime(date.getTime() + amount);
        return getDateInfo(date);
    };

    const getDayNameFormatted = dateFormatted => getDayName(getDateFormatted(dateFormatted).getDay()) + ' ';
    
    const getDateFormatted = dateInfo => new Date(dateInfo[2], dateInfo[1], dateInfo[0], dateInfo[3], dateInfo[4] + 0, 0);

    //Compare dates
    const comp = (a, b) => new Date(a.start.dateTime || a.start.date).getTime() - new Date(b.start.dateTime || b.start.date).getTime();  

    //Add one day
    const addOneDay = (dateInfo) => calculateDate(dateInfo, 86400000);
    
    //Subtract one day
    const subtractOneDay = (dateInfo) => calculateDate(dateInfo, -86400000);

    //Subtract one minute
    const subtractOneMinute = (dateInfo) => calculateDate(dateInfo, -60000);


    //Transformations for formatting date into human readable format
    const formatDateSameDay = (dateStart, dateEnd, dayNames, moreDaysEvent, isAllDayEvent) => {
        var formattedTime = '',
            dayNameStart = '';

        if (dayNames) {
          dayNameStart = getDayNameFormatted(dateStart);
        }

        if (config.sameDayTimes && !moreDaysEvent && !isAllDayEvent) {
            formattedTime = ' from ' + getFormattedTime(dateStart) + ' - ' + getFormattedTime(dateEnd);
        }

        //month day, year time-time
        return dayNameStart + getMonthName(dateStart[1]) + ' ' + dateStart[0] + ', ' + dateStart[2] + formattedTime;
    };

    const formatDateOneDay = (dateStart, dayNames) => {
      var dayName = '';

      if (dayNames) {
        dayName = getDayNameFormatted(dateStart);
      }
      //month day, year
      return dayName + getMonthName(dateStart[1]) + ' ' + dateStart[0] + ', ' + dateStart[2];
    };

    const formatDateDifferentDay = (dateStart, dateEnd, dayNames) => {
      var dayNameStart = '',
          dayNameEnd = '';

      if (dayNames) {
        dayNameStart = getDayNameFormatted(dateStart);
        dayNameEnd = getDayNameFormatted(dateEnd);
      }
        //month day-day, year
        return dayNameStart + getMonthName(dateStart[1]) + ' ' + dateStart[0] + '-' + dayNameEnd + dateEnd[0] + ', ' + dateStart[2];
    };

    const formatDateDifferentMonth = (dateStart, dateEnd, dayNames) => {
      var dayNameStart = '',
          dayNameEnd = '';

      if (dayNames) {
        dayNameStart = getDayNameFormatted(dateStart);
        dayNameEnd = getDayNameFormatted(dateEnd);
      }
        //month day - month day, year
        return dayNameStart + getMonthName(dateStart[1]) + ' ' + dateStart[0] + '-' + dayNameEnd + getMonthName(dateEnd[1]) + ' ' + dateEnd[0] + ', ' + dateStart[2];
    };

    const formatDateDifferentYear = (dateStart, dateEnd, dayNames) => {
      var dayNameStart = '',
          dayNameEnd = '';

      if (dayNames) {
        dayNameStart = getDayNameFormatted(dateStart);
        dayNameEnd = getDayNameFormatted(dateEnd);
      }
        //month day, year - month day, year
        return dayNameStart + getMonthName(dateStart[1]) + ' ' + dateStart[0] + ', ' + dateStart[2] + '-' + dayNameEnd + getMonthName(dateEnd[1]) + ' ' + dateEnd[0] + ', ' + dateEnd[2];
    };

    //Check differences between dates and format them
    const getFormattedDate = (dateStart, dateEnd, dayNames, moreDaysEvent, isAllDayEvent) => {
        var formattedDate = '';

        if (dateStart[0] === dateEnd[0]) {
            if (dateStart[1] === dateEnd[1]) {
                if (dateStart[2] === dateEnd[2]) {
                    //month day, year
                    formattedDate = formatDateSameDay(dateStart, dateEnd, dayNames, moreDaysEvent, isAllDayEvent);
                } else {
                    //month day, year - month day, year
                    formattedDate = formatDateDifferentYear(dateStart, dateEnd, dayNames);
                }
            } else {
                if (dateStart[2] === dateEnd[2]) {
                    //month day - month day, year
                    formattedDate = formatDateDifferentMonth(dateStart, dateEnd, dayNames);
                } else {
                    //month day, year - month day, year
                    formattedDate = formatDateDifferentYear(dateStart, dateEnd, dayNames);
                }
            }
        } else {
            if (dateStart[1] === dateEnd[1]) {
                if (dateStart[2] === dateEnd[2]) {
                    //month day-day, year
                    formattedDate = formatDateDifferentDay(dateStart, dateEnd, dayNames);
                } else {
                    //month day, year - month day, year
                    formattedDate = formatDateDifferentYear(dateStart, dateEnd, dayNames);
                }
            } else {
                if (dateStart[2] === dateEnd[2]) {
                    //month day - month day, year
                    formattedDate = formatDateDifferentMonth(dateStart, dateEnd, dayNames);
                } else {
                    //month day, year - month day, year
                    formattedDate = formatDateDifferentYear(dateStart, dateEnd, dayNames);
                }
            }
        }

        return formattedDate;
    };

    const getFormattedTime = (date) => {
        var formattedTime = '',
            period = 'AM',
            hour = date[3],
            minute = date[4];

        // Handle afternoon.
        if (hour >= 12) {
            period = 'PM';

            if (hour >= 13) {
                hour -= 12;
            }
        }

        // Handle midnight.
        if (hour === 0) {
            hour = 12;
        }

        // Ensure 2-digit minute value.
        minute = (minute < 10 ? '0' : '') + minute;

        // Format time.
        formattedTime = hour + ':' + minute + period;
        return formattedTime;
    };

    return { 
        init: function (settingsOverride) {
            var settings = {
                calendarUrl: 'https://www.googleapis.com/calendar/v3/calendars/kingstongymnastics.org_7nh2823r0dllga1ubh0h6cscoo%40group.calendar.google.com/events?singleEvents=true&key=AIzaSyA-8SoMmPo6oXfuuioyhbxS1TS4p3nDWMY',
                past: true,
                upcoming: true,
                sameDayTimes: true,
                dayNames: true,
                pastTopN: -1,
                upcomingTopN: -1,
                recurringEvents: true,
                itemsTagName: 'li',
                upcomingSelector: '#events-upcoming',
                pastSelector: '#events-past',
                upcomingHeading: '<h2>Upcoming events</h2>',
                pastHeading: '<h2>Past events</h2>',
                format: ['*date*', ': ', '*summary*', ' &mdash; ', '*description*', ' in ', '*location*'],
                timeMin: undefined,
                timeMax: undefined
            };

            settings = mergeOptions(settings, settingsOverride);

            init(settings);
        }
    };
});