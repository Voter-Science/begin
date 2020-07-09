// Sample 'Hello World' Plugin template.
// Demonstrates:
// - typescript
// - using trc npm modules and browserify
// - uses promises.
// - basic scaffolding for error reporting.
// This calls TRC APIs and binds to specific HTML elements from the page.

import * as trcSheet from 'trc-sheet/sheet'

import * as plugin from 'trc-web/plugin'
import { SheetTreeViewControl } from './treehelper'

declare var $: JQueryStatic;

interface IDictionary<T> {
    [Key: string]: T;
}

export class MyPlugin {
    private _sheet: trcSheet.SheetClient;
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
                .addClass("btn").addClass("btn-green").addClass("btn-small")
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
                .addClass("btn").addClass("btn-green").addClass("btn-small")
                .removeClass("plugin")
                .attr("href", this.getGotoLinkForPlugin(pluginId))
                .attr("target", "_blank");
        });
    }

    // Where <a id="gotoListView" target="_blank">text</a>
    // $("#gotoListView").attr("href", this.getGotoLinkForPlugin("ListView"));
    private getGotoLinkForPlugin(pluginId: string, sheetId? : string): string {
        if (!sheetId) { sheetId = this._sheet._sheetId};

        if (this._opts == undefined) {
            return "https://canvas.voter-science.com/plugin/" + sheetId  +"/" + pluginId;
        }

        return this._opts.gotoUrl + "/" + sheetId + "/" +
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

                var tree = new SheetTreeViewControl("treeroot", this._sheet, info);
                tree.initTree((sheetId)=> this.onTreeNodeSelect(sheetId));
            })
        });
    }



    private onTreeNodeSelect(data : trcSheet.IGetChildrenResultEntry) : void {
        var name = data.Name;
        var sheetId = data.Id;

        $("#quickactions").empty();

        var e1 = $("<a>")
                // .addClass("btn").addClass("btn-green").addClass("btn-small")
                .addClass("btn").addClass("btn-green")
                .attr("href", this.getGotoLinkForPlugin("Begin", sheetId))
                .attr("target", "_blank")
                .text("Goto '" + name +'\'');

        var e2 = $("<a>")
                // .addClass("btn").addClass("btn-green").addClass("btn-small")
                .addClass("btn").addClass("btn-green")
                .attr("href", this.getGotoLinkForPlugin("Share", sheetId))
                .attr("target", "_blank")
                .text("Share '" + name + "'...");

        var space = $("<span>").text("  ");

        $("#quickactions").append(e1).append(space).append(e2);
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
