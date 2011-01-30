/*

Copyright (c) 2011 Prabhat Gupta(prabhatgupta.webs.com | golygon.com)

This script may be used for non-commercial purposes only. For any
commercial purposes, please contact the author at 
itisme.prabhat@gmail.com

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/

$('.wikiItem').click(function(e){

    var place = $(this).text();
    var mouseFromLeft = e.pageX;
    var mouseFromTop = e.pageY;
    
    var header = $('<div />').addClass('popUpHeader').text(place);
    var content = $('<div />').attr('id', 'popUp_summary')
                    .addClass('popUpContent')
                    .append($('<img/>').attr({'id':'loader', 'src':'images/ajax-loader.gif', 'alt':'Loading, Loading!'}))
                    .append($('<a/>').attr({'id':'closeLink'}).html('<br/><br />close'))
                    .appendTo('body');
    
    $('<div />').attr('id', 'popUpBox')
          .addClass('popUp')
          .css({'top':mouseFromTop, 'left':mouseFromLeft})
          .append(header)
          .append(content)
          .appendTo('body'); 
    getSummary_Wikipedia(place);

});

$('#closeLink').live('click', function(){
          $('#popUpBox').remove();
        });

function getSummary_Wikipedia(page_id) {
      title = page_id;
      $.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        data: {
          action:'parse',
          prop:'text',
          page:title,
          format:'json'
        },
        dataType:'jsonp',
        success: function(data) {
          wikipage = $("<div>"+data.parse.text['*']+"<div>").children('p:first');
          wikipage.find('sup').remove();
          wikipage.find('a').each(function() {
             var href = $(this).attr('href');
             /* put a check for wikipedia link. do not touch rest of the links*/
             $(this)
                .attr('href', "javascript:getSummary_Wikipedia('"+ href.substring(href.lastIndexOf('/')+1) +"')")
          });
          $('#loader').hide();
          $("#popUp_summary").html(wikipage);
          $("#popUp_summary").append($('<a />').attr({'id':'closeLink'}).html('<br /><br />close'));
          $("#popUp_summary").append($('<a />').attr({'href':'http://en.wikipedia.org/wiki/'+title, 'id':'readMore', 'target':'wikipedia'}).html('&nbsp;Read More'));
        }
      });
}

$(document).mousedown(function(e) {
        if (!$(e.target).closest('#popUpBox').length)
             $('#popUpBox').remove();
        //$('#popUpBox').fadeOut('fast');
      });
    
