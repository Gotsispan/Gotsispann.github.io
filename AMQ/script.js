

SECURE_REFERRER_POLICY = "no-referrer-when-downgrade"

$(document).ready(function () {

    var $pagination = $("#pagination"),
      totalRecords = 0,
      records = [],
      recPerPage = 0,
      nextPageToken = "",
      totalPages = 0;
    var API_KEY = "";
    var search = "";
    var duration = "any";
    var order = "relevance";
    var beforedate = new Date().toISOString();
    var afterdate = new Date().toISOString();
    var maxResults=10
   
    $("#beforedate").val(beforedate)
    $("#afterdate").val(afterdate)
   
    $("#beforedate").change(function(){
        beforedate = new Date(this.val()).toISOString()
        $("#beforedate").val(beforedate)
        afterdate = new Date(this.val()).toISOString()
        $("#afterdate").val(afterdate)
    })
   
    $("#afterdate").change(function(){
      afterdate = new Date(this.val()).toISOString()
      $("#afterdate").val(afterdate)
      beforedate = new Date(this.val()).toISOString()
      $("#beforedate").val(beforedate)
  })
   
    $("#duration").change(function () {
      duration = $(this).children("option:selected").val();
    });
    $("#order").change(function () {
      order = $(this).children("option:selected").val();
  
    });
   
    $("#myForm").submit(function (e) {
      e.preventDefault();
   
      search = $("#search").val();
   
      //beforedate = new Date($("#beforedate").val()).toISOString();
   
      //afterdate = new Date($("#beforedate").val()).toISOString();
   
      console.log(beforedate);
   
      API_KEY = "AIzaSyAE83aypAWuPtbJerRjerm3Mf-TpQQYwLc";
   
      var url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}
          &part=snippet&q=${search}&maxResults=${maxResults}&publishedAfter=${afterdate}&publishedBefore=${beforedate}&order=${order}&videoDuration=${duration}&type=video`;
      
      $.ajax({
        method: "GET",
        url: url,
        beforeSend: function () {
          $("#btn").attr("disabled", true);
          $("#results").empty();
        },
        success: function (data) {
          console.log(data);
          $("#btn").attr("disabled", false);
          displayVideos(data);
        },
      });
    });
   
    function apply_pagination() {
      $pagination.twbsPagination({
        totalPages: totalPages,
  
        visiblePages: 6,
        onPageClick: function (event, page) {
          console.log(event);
          displayRecordsIndex = Math.max(page - 1, 0) * recPerPage;
          endRec = displayRecordsIndex + recPerPage;
          console.log(displayRecordsIndex + "ssssssssss" + endRec);
          displayRecords = records.slice(displayRecordsIndex, endRec);
          generateRecords(recPerPage, nextPageToken);
        },
      });
    }
   
    $("#search").change(function () {
      search = $("#search").val();
    });
   
    function generateRecords(recPerPage, nextPageToken) {
      var url2 = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}
      &part=snippet&q=${search}&maxResults=${maxResults}&pageToken=${nextPageToken}&publishedBefore=${beforedate}&publishedAfter=${afterdate}&order=${order}&videoDuration=${duration}&type=video`;
   
      $.ajax({
        method: "GET",
        url: url2,
        beforeSend: function () {
          $("#btn").attr("disabled", true);
          $("#results").empty();
        },
        success: function (data) {
          console.log(data);
          $("#btn").attr("disabled", false);
          displayVideos(data);
        },
      });
    }
   
    function displayVideos(data) {

      var randno = Math.floor(Math.random()*10)
      randno = 0;
      let startime = 30;
      let endtime = 50;
      let newurl = "https://www.youtube.com/embed/" + data.items[randno].id.videoId
      newurl +=  "?enablejsapi=1&version=3&playerapiid=ytplayer" + "&start=" + startime + "&end=" + endtime
      document.getElementById("videoplayed").src = newurl;

      recPerPage = data.pageInfo.resultsPerPage;
      nextPageToken = data.nextPageToken;
      totalRecords = data.pageInfo.totalResults;
      totalPages = Math.ceil(totalRecords / recPerPage);
      apply_pagination();
      $("#search").val("");
   
      var videoData = "";
   
      $("#table").show();
   
      data.items.forEach((item) => {
        videoData = `
                      
                      <tr>
                      <td>
                      <a target="_blank" href="https://www.youtube.com/watch?v=${item.id.videoId}">
                      ${item.snippet.title}</td>
                      <td>
                      <img width="200" height="200" src="${item.snippet.thumbnails.high.url}"/>
                      </td>
                      <td>
                      <a target="_blank" href="https://www.youtube.com/channel/${item.snippet.channelId}">${item.snippet.channelTitle}</a>
                      </td>
                      </tr>
   
                      `;
   
        $("#results").append(videoData);
      });
    }
  });

  $('a.play-video').click(function(){
    $('.youtube-video')[0].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
  });
  
  $('a.stop-video').click(function(){
    $('.youtube-video')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
  });
  
  $('a.pause-video').click(function(){
    $('.youtube-video')[0].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
  });