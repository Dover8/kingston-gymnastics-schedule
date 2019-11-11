# Kingston Gymnastics Club Training Schedule

A timetable system used to display the club training times on the [clubs website](https://kingstongymnastics.org/about/timetable] Powered by data from a google calendar to allow the admins to make changes to the schedule when needed, without having to have access to the website itself. 

Built out of two existing open source repos:

[Milan Lunds Google Calendar Formatter](https://github.com/MilanLund/FormatGoogleCalendar)
[CodyHouse Framework](https://github.com/CodyHouse/codyhouse-framework).

##Google Calendar Formatter

This project allowed for the pulling in of events from a public Google Calendar. The original project just pulls these in as a list that can then be formatted into the HTML, allowing you to differentiate between Past and Upcoming Events. See the [original demo](http://www.kacurak.com/formatgooglecalendar/example.html).

I had to modify what the code did with the data it fetched from Google Calendar, mainly around the way it formatted it for HTML. I also used a [datepicker](https://bootstrap-datepicker.readthedocs.io/en/latest/) to drive the date range for the events that were requested from the calendar. 

##CodyHouse Framework

This was the original design that caught my eye as something suitable to use for a timetable on the site. 

The original [demo](https://codyhouse.co/demo/schedule-template) had a layout for a gym. It looks great, but the problem we have for Kingston Gymnastics is that many classes overlap, and the vertical layout wasn't really working, as you can see from the screenshot of Google Calendar ![Google Calendar image](https://i.imgur.com/zYRMJFr.png "Google Calender of week events.")

Initially I used the template as it was, switching the layout to horizontal for each day. From there I started to add some automation around the layout when events overlapped by tagging events in HTML if they overlapped with another. 

I moved away from that and started to check in the js if an event overlapped with the previous one, which worked but could result in extra linesrequired. Moved to monitoring a whole day group so that later events could move back up in to the highest available row with space. 

For more info on the Schedule template, see this [Article on CodyHouse](https://codyhouse.co/gem/schedule-template) 
[License](https://codyhouse.co/license)

##Bringing the two together. 

The final step was to remove all the hardcoded HTML that drove the new Schedule layout, and to instead populate it with the data pulled from the Google Calendar Formatter. This was a lot of trial and error, but also a fair learning experience. I didn't want to mess around too much with the existing projects, so was trying to call functions between the two. The Schedule was set up just to render when the page loaded, but I needed it to refresh when the user changed dates in the date picker. 

I also had two separate instances of the Schedule as the club opporates after school hours during the week, but earlier at the weekend. To save on layout space I separated them so that the space for the timelines could be best utalized. 

This meant grabbing a reference of the Schedules themselves, and asking them to update their layouts when the user changes the dates selected in the datepicker. 

##Still TODO

The elements on the schedule are selectable. I've still to populate these popups with the data for the event types. I'll likely update the names for the event types to make more sense based on the classes on offer at the club. 
