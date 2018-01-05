
var pwaDemo = {
    basePath: "",
    jsonList: {
        'dynamic': true
    },
    pageChange: function(url) {
        console.log("Receiving page change event:")
        console.log("- Full url:", url);

        url = url.replace(pwaDemo.basePath, "");
        console.log("- Trimmed url:", url);

        var sliceIndex = -1;
        var fragment = "";
        sliceIndex = url.indexOf("#");

        if (sliceIndex != -1) {
            fragment = url.slice(sliceIndex + 1);

            if (fragment.startsWith('!')) {
                fragment = fragment.slice(1);
            }
        } else {
            fragment = url;

            if (fragment.endsWith('.html')) {
                fragment = fragment.slice(0, -5);
            }
        }

        if (fragment) {
            console.log("- Fragment:", fragment);

            if (fragment in pwaDemo.jsonList) {
                console.log("- Result: Fetching JSON & rendering client-side.");

                fetch(fragment + '.json').then(function(response) {
                    return response.text();
                }).then(function(data) {
                    pwaDemo.processJSON(JSON.parse(data));
                }).catch(function(error) {
                    console.log('Fetch error: ', error);
                })
            } else {
                console.log("- Result: Fragment not found in list of dynamic pages. Taking no action on client-side JS.");
            }
        }
    },
    processJSON: function(jsonData) {
        var contentTag = document.querySelector('#content');
        
        document.querySelector('h1').innerText = jsonData.page.title;        
        document.querySelector('html > head > title').innerText = jsonData.page.title;
        contentTag.innerHTML = 'content' in jsonData.page ? jsonData.page.content : '';
    }
}

document.addEventListener('click', function(e) {
    if (e.target.tagName == 'A' && e.target.classList.contains('dynamic')) {
      e.preventDefault();
  
      var newUrl = e.target.href;
      var linkDescription = e.target.text;
  
      history.pushState(false, linkDescription, newUrl);
  
      pwaDemo.pageChange(newUrl);
    }
}, false);

window.addEventListener('load', function(e) {
    console.log("Initial server-side render ready.");

    pwaDemo.basePath = window.location.toString().split('/').slice(0, -1).join('/') + "/";
    
    window.addEventListener('popstate', function(event) {
       pwaDemo.pageChange(window.location.toString());
    });

    pwaDemo.pageChange(window.location.toString());
}, false);


