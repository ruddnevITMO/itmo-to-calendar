  // by ruddnev

  function doGet(e) {
    // .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    var htmlOutput = HtmlService.createHtmlOutputFromFile("webapp")
    htmlOutput.addMetaTag('viewport', 'width=device-width, initial-scale=1');
    htmlOutput.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    return htmlOutput;
  }

  function calendarJSON(contextText, options) {
    calendar(contextText, options);
  }

  function calendar(contextText, options) {
    const data = JSON.parse(contextText).data;  
    
    if (options.isMultiCalendar) { 
      var oldCalendar = CalendarApp.getCalendarsByName(options.lectureName)[0];
      if (oldCalendar == null) {
        var lectureCalendar = CalendarApp.createCalendar(options.lectureName, { 
          summary: 'Расписание лекций в университете ИТМО',
          color: options.lectureColor
        });
      } else {
        var lectureCalendar = oldCalendar;
        if (options.isChangeExistingColor) lectureCalendar.setColor(options.lectureColor);
      }
      lectureCalendar.setTimeZone("Europe/Moscow");

      var oldCalendar = CalendarApp.getCalendarsByName(options.practiceName)[0];
      if (oldCalendar == null) {
        var practiceCalendar = CalendarApp.createCalendar(options.practiceName, { 
          summary: 'Расписание практических занятий в университете ИТМО',
          color: options.practiceColor
        });
      } else {
        var practiceCalendar = oldCalendar;
        if (options.isChangeExistingColor) practiceCalendar.setColor(options.practiceColor);
      }
      practiceCalendar.setTimeZone("Europe/Moscow");
      
      var oldCalendar = CalendarApp.getCalendarsByName(options.labName)[0];
      if (oldCalendar == null) {
        var labCalendar = CalendarApp.createCalendar(options.labName, { 
          summary: 'Расписание лабораторных занятий в университете ИТМО',
          color: options.labColor
        });
      } else {
        var labCalendar = oldCalendar;
        if (options.isChangeExistingColor) labCalendar.setColor(options.labColor);
      }
      labCalendar.setTimeZone("Europe/Moscow");
      
      var oldCalendar = CalendarApp.getCalendarsByName(options.sportName)[0];
      if (oldCalendar == null) {
        var sportCalendar = CalendarApp.createCalendar(options.sportName, { 
          summary: 'Расписание спорта в университете ИТМО',
          color: options.sportColor
        });
      } else {
        var sportCalendar = oldCalendar;
        if (options.isChangeExistingColor) sportCalendar.setColor(options.sportColor);
      }
      sportCalendar.setTimeZone("Europe/Moscow");
      
      var oldCalendar = CalendarApp.getCalendarsByName(options.otherName)[0];
      if (oldCalendar == null) {
        var otherCalendar = CalendarApp.createCalendar(options.otherName, { 
          summary: 'Расписание всего кроме основных занятий и спорта в университете ИТМО',
          color: options.otherColor
        });
      } else {
        var otherCalendar = oldCalendar;
        if (options.isChangeExistingColor) otherCalendar.setColor(options.otherColor);
      }
      otherCalendar.setTimeZone("Europe/Moscow");

      
    } else {
      var oldCalendar = CalendarApp.getCalendarsByName(options.calendarName)[0];
      if (oldCalendar == null) {
        var mainCalendar = CalendarApp.createCalendar(options.calendarName, { 
          summary: 'Расписание занятий в университете ИТМО',
          color: options.calendarColor
        });
      } else {
        var mainCalendar = oldCalendar;
        if (options.isChangeExistingColor) mainCalendar.setColor(options.calendarColor);
      }
      mainCalendar.setTimeZone("Europe/Moscow");
    }

    const today = new Date();

    for (var dayNum = 0; dayNum < data.length; dayNum++) {
      var day = data[dayNum];
      var currDay = new Date(day.date);
      var dayLectures = []
      if (options.isMultiCalendar) {
        
        lectureCalendar.getEventsForDay(currDay).forEach(function(event) {
          if (event.getDescription().includes("Обновлено: ")) event.deleteEvent();
        });
        practiceCalendar.getEventsForDay(currDay).forEach(function(event) {
          if (event.getDescription().includes("Обновлено: ")) event.deleteEvent();
        });
        labCalendar.getEventsForDay(currDay).forEach(function(event) {
          if (event.getDescription().includes("Обновлено: ")) event.deleteEvent();
        });
        sportCalendar.getEventsForDay(currDay).forEach(function(event) {
          if (event.getDescription().includes("Обновлено: ")) event.deleteEvent();
        });
        otherCalendar.getEventsForDay(currDay).forEach(function(event) {
          if (event.getDescription().includes("Обновлено: ")) event.deleteEvent();
        });
      } else {
        mainCalendar.getEventsForDay(currDay).forEach(function(event) {
          if (event.getDescription().includes("Обновлено: ")) event.deleteEvent();
        });
      }


      for (var lessonNum = 0; lessonNum < day.lessons.length; lessonNum++) {
        var lesson = day.lessons[lessonNum];

        var timeStartArray = lesson.time_start.split(":");
        var timeStart = new Date(day.date);
        timeStart.setHours(timeStartArray[0]);
        timeStart.setMinutes(timeStartArray[1]);
        
        var timeEndArray = lesson.time_end.split(":");
        var timeEnd = new Date(day.date);
        timeEnd.setHours(timeEndArray[0]);
        timeEnd.setMinutes(timeEndArray[1]);

        var goodBuilding = String(lesson.building);
        if (goodBuilding.includes("null")) {
          lessonLocation = "";
        } else {
          if (options.isShortenAddress) {
            if (goodBuilding.includes("ул.Ломоносова, д.9, лит. А")) {
              goodBuilding = "Ломо ⛪️";
            } else if (goodBuilding.includes("Ломонос")) {
              goodBuilding = "Ломо";
            } else if (goodBuilding.includes("Кронв")) {
              goodBuilding = "Кронва";
            } else if (goodBuilding.includes("Песоч")) {
              goodBuilding = "Песочка";
            } else if (goodBuilding.includes("Гривц")) {
              goodBuilding = "Грива";
            } else if (goodBuilding.includes("Бирж")) {
              goodBuilding = "Биржа";
            } else if (goodBuilding.includes("Чайк")) {
              goodBuilding = "Чайка";
            } 
          }
          lessonLocation = lesson.room.replace("ауд. ", "") + ", " + goodBuilding;
        }

        var teacherName = lesson.teacher_name;
        if (teacherName == null && lesson.note != null) {
          teacherName = lesson.note;
        }

        if (options.isMultiCalendar) {
          var currCalendar;
          if (lesson.type.includes("Лекции")) {
            currCalendar = lectureCalendar;
          } else if (lesson.type.includes("Практические занятия")) {
            currCalendar = practiceCalendar;
          } else if (lesson.type.includes("Лабораторные занятия")) {
            currCalendar = labCalendar;
          } else if (lesson.type.includes("Занятия спортом")) {
            currCalendar = sportCalendar;
          } else {
            currCalendar = otherCalendar;
          }
          
          
          var event = currCalendar.createEvent(lesson.subject,
            timeStart,
            timeEnd,
            {location: lessonLocation, 
              description: 
                lesson.type + 
                "\nГруппа: " + lesson.group + 
                "\nПреподаватель: " + teacherName +
                "\nОбновлено: " + today.toUTCString()});
          
        } else {

          

          var event = mainCalendar.createEvent(lesson.subject,
          timeStart,
          timeEnd,
          {location: lessonLocation, 
            description: 
              lesson.type + 
              "\nГруппа: " + lesson.group + 
              "\nПреподаватель: " + teacherName +
              "\nОбновлено: " + today.toUTCString()});
                
          if (!options.isColoredSingle) {
            if (lesson.type.includes("Лекции")) {
              event.setColor(CalendarApp.EventColor.PALE_BLUE);
              // event.setColor("#0091ff");
            } else if (lesson.type.includes("Практические занятия")) {
              event.setColor(CalendarApp.EventColor.YELLOW);
              // event.setColor("#f7b500");
            } else if (lesson.type.includes("Зачет") || lesson.type.includes("Экзамен")) {
              event.setColor(CalendarApp.EventColor.RED);
              // event.setColor("#ee215b");
            } else if (lesson.type.includes("Лабораторные занятия")) {
              event.setColor(CalendarApp.EventColor.MAUVE);
              // event.setColor("#a50aff");
            } else if (lesson.type.includes("Консультация к экзамену")) {
              event.setColor(CalendarApp.EventColor.BLUE);
              // event.setColor("#1846c7");
            } else if (lesson.type.includes("Занятия спортом")) {
              event.setColor(CalendarApp.EventColor.PALE_GREEN);
              // event.setColor("#22b217");
            } 
          }
        }
      }
    }
  }










