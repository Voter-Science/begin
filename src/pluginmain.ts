// Sample 'Hello World' Plugin template.
// Demonstrates:
// - typescript
// - using trc npm modules and browserify
// - uses promises.
// - basic scaffolding for error reporting.
// This calls TRC APIs and binds to specific HTML elements from the page.

import * as XC from 'trc-httpshim/xclient'
import * as common from 'trc-httpshim/common'

import * as core from 'trc-core/core'

import * as trcSheet from 'trc-sheet/sheet'

import * as plugin from 'trc-web/plugin'
import * as trchtml from 'trc-web/html'


// Installed via:
//   npm install --save-dev @types/jquery
// requires tsconfig: "allowSyntheticDefaultImports" : true
declare var $: JQueryStatic;

// Provide easy error handle for reporting errors from promises.  Usage:
//   p.catch(showError);
declare var showError: (error: any) => void; // error handler defined in index.html

interface IDictionary<T> {
    [Key: string]: T;
}

export class MyPlugin {
    private _sheet: trcSheet.SheetClient;
    private _pluginClient: plugin.PluginClient;
    private _opts: plugin.IPluginOptions;

    // Scan for all <a> with "plugin" class and make into link.
    // <a class="plugin">{PluginId}</a>
    private applyAllPlugins(): void {
        $("a[plugin]").each((idx, element) => {
            // Text is the
            var e = $(element);
            var text: string = element.innerText;

            var pluginId : string = e.attr("plugin");

            if (!text || text.length == 0) {
                element.innerText = "Use " + pluginId;
            }

            var url = this.getGotoLinkForPlugin(pluginId);
            e
                .addClass("btn").addClass("btn-blue").addClass("btn-small")
                .attr("href", this.getGotoLinkForPlugin(pluginId))
                .attr("target", "_blank");
        });

        // TODO - remove this case.
        $("a.plugin").each((idx, e) => {
            // Text is the
            var pluginId: string = e.innerText;
            e.innerText = "Use " + pluginId;
            var url = this.getGotoLinkForPlugin(pluginId);
            $(e)
                .addClass("btn").addClass("btn-blue").addClass("btn-small")
                .removeClass("plugin")
                .attr("href", this.getGotoLinkForPlugin(pluginId))
                .attr("target", "_blank");
        });
    }

    // Where <a id="gotoListView" target="_blank">text</a>
    // $("#gotoListView").attr("href", this.getGotoLinkForPlugin("ListView"));
    private getGotoLinkForPlugin(pluginId: string): string {
        if (this._opts == undefined) {
            return "/"; // avoid a crash
        }
        return this._opts.gotoUrl + "/" + this._sheet._sheetId + "/" +
            pluginId + "/index.html";
    }


    public static BrowserEntryAsync(
        auth: plugin.IStart,
        opts: plugin.IPluginOptions
    ): Promise<MyPlugin> {

        var pluginClient = new plugin.PluginClient(auth, opts,undefined);

        // Do any IO here...

        var throwError = false; // $$$ remove this

        var plugin2 = new MyPlugin(pluginClient);

        plugin2._opts = opts;
        return plugin2.InitAsync().then(() => {
            plugin2.applyAllPlugins();
            return plugin2;
        });
    }

    // Expose constructor directly for tests. They can pass in mock versions.
    public constructor(p: plugin.PluginClient) {
        this._sheet = new trcSheet.SheetClient(p.HttpClient, p.SheetId);
    }


    // Make initial network calls to setup the plugin.
    // Need this as a separate call from the ctor since ctors aren't async.
    private InitAsync(): Promise<void> {
        return this._sheet.getInfoAsync().then(info => {

            var dict : IDictionary<trcSheet.IColumnInfo> =  {} ;

            info.Columns.forEach(c => {
                dict[c.Name.toLowerCase()] = c;
            });

            return this._sheet.getChildrenAsync().then(childInfo => {

                $("div[hasColumn]").each((idx, element) => {
                    var e = $(element);
                    var cn = e.attr("hasColumn");
                    if (!dict.hasOwnProperty(cn.toLowerCase())) {
                        e.hide();
                    }
                });


                // Set styles
                document.title = "Voter-Science: " + info.Name;


                if (!info.ParentId) {
                    $(".topLevel").show();
                    $(".notTopLevel").hide();
                } else {
                    $(".topLevel").hide();
                    $(".notTopLevel").show();
                }

                if (!!childInfo.entries && childInfo.entries.length > 0)
                {
                    $(".hasChildren").show();
                } else {
                    $(".hasChildren").hide();
                }

                this.updateInfo(info);
            })
        });
    }

    // Display sheet info on HTML page
    public updateInfo(info: trcSheet.ISheetInfoResult): void {
        $("#SheetName").text(info.Name);
        $("#ParentSheetName").text(info.ParentName);
        $("#SheetVer").text(info.LatestVersion);
        $("#RowCount").text(info.CountRecords);

        $("#LastRefreshed").text(new Date().toLocaleString());
    }

}
