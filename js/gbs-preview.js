/*
 * Google Books Preview demo
 * Ulrich Leodolter <ulrich.leodolter@obvsg.at>
 */
app.controller('GoogleBooksFullViewAfterController', ['$http', function ($http) {
    var vm = this;
    
    /*
     * Get ISBN numbers from pnx.addata.isbn
     */
    vm.gbs_isbns = [];
    if ('isbn' in vm.parentCtrl.item.pnx.addata) {
        vm.gbs_isbns = vm.parentCtrl.item.pnx.addata.isbn;
    }
    /*
     * Set defaults
     */
    vm.gbs_books = [];
    vm.gbs_lang  = '';
    try {
        vm.gbs_lang = vm.parentCtrl.fullViewService.$state.params.lang.substr(0,2);
    } catch(err) {
        vm.gbs_lang = 'en';
    }

    /*
     * $onInit() - Called on each controller after all the controllers on an element have been constructed
     * and had their bindings initialized (and before the pre & post linking functions for the directives on this element).
     * This is a good place to put initialization code for your controller.
     */

    vm.$onInit = function() {

        var vid   = vm.parentCtrl.fullViewService.vid;
        var isbns = vm.gbs_isbns;

        /*
         * Consume Google Books API - Dynamic Links
         * https://developers.google.com/books/docs/dynamic-links
         */

        if (isbns.length > 0) {
            var url = 'https://books.google.com/books?jscmd=viewapi&bibkeys=ISBN:' + isbns.join() + '&callback=JSON_CALLBACK';
            $http.jsonp(url).success(function(data) {
                for (var isbn in data) {
                    var book = data[isbn];
                    if (book.preview == 'full' || book.preview == 'partial') {
                        vm.gbs_books.push(book);
                    } 
                }
            });
        }
    };
}]);

app.component('prmFullViewAfter', {
    bindings: {parentCtrl: '<'},
    controller: 'GoogleBooksFullViewAfterController',
    template: `
        <div class="full-view-section gbs-preview" ng-if="$ctrl.gbs_books.length > 0" flex-md="80" flex-lg="80" flex-xl="80" flex>
            <div class="full-view-section-content">
                <div>
                    <div class="section-head">
                        <div layout="row" layout-align="center center" class="layout-align-center-center layout-row">
                            <h2 class="section-title md-title light-text">Google Books Preview</h2>
                            <md-divider flex></md-divider>
                       </div>
                    </div>
                    <div class="section-body">
                        <div class="spaced-rows">
                             <div style="padding-top:1em;" ng-repeat="book in $ctrl.gbs_books">
                                 <div class="gbs-preview book">
                                    <img src="{{book.thumbnail_url}}"/>
                                    <a href="{{book.preview_url}}" target="_blank">
                                        <img src="https://www.google.com/intl/{{$ctrl.gbs_lang}}/googlebooks/images/gbs_preview_button1.gif" border="0" style="margin-left: 0.5em" />
                                    </a>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
});
