
import * as trcSheet from 'trc-sheet/sheet'


// These should be in trcSheet. 
interface IShareSheetResult {

}
interface IChildSummaryInfoEntry {
    SheetId: string;
    ChildInfo: trcSheet.ISheetInfoResult;
    ShareInfo: IShareSheetResult[];
    SharesSandbox: boolean;
    IsAutoShard: boolean;

    Filter: string;
    Name: string;
}
interface IChildSummaryInfo {
    Children: IChildSummaryInfoEntry[];
}


// Calls are made lazily as the tree is expanded in the UI. 
// Collapsing & re-expanding doesn't make new calls. 
export class SheetTreeViewControl {

    // Fixed 
    private readonly _sheet: trcSheet.SheetClient;
    private readonly _info: trcSheet.ISheetInfoResult;
    private readonly _docId: string; // id of the <div> root to host this control in. 

    // Currently selected node. 
    private _currentSheetId: string;

    // cache from  sheetId to results about that sheet. 
    private _cache: { [sheetId: string]: trcSheet.IGetChildrenResultEntry; } = {};
    private _cache2: { [sheetId: string]: IChildSummaryInfoEntry; } = {};

    public constructor(htmlElementId: string,
        sheet: trcSheet.SheetClient,
        info: trcSheet.ISheetInfoResult) {
        this._docId = htmlElementId;
        this._sheet = sheet;
        this._info = info;
    }
    
    public initTree(): void {
        var jTree: any = $('#treeroot'); // $$$ get d.ts
        jTree.jstree({
            'core': {
                check_callback: true,
                // closure rules. 
                'data': (node: any, cb: any) => this.populateTree(node, cb)
            }
        });

        $('#treeroot').on("changed.jstree", (e: any, data: any) => {
            var sheetId = data.selected[0];
            // alert("The selected nodes are:" + data.selected);
            this.selectNode(sheetId);
        });
    }



    // Called when a node is selected in the UI 
    private selectNode(sheetId: string): void {
        this._currentSheetId = sheetId;
        if (sheetId == null) {
            return;
        }
        alert("Selected: " + sheetId);
    }

    // populate Tree control
    // Called at each level to populate the tree
    private populateTree(node: any, cb: any) {
        if (node.id === "#") {
            // Root node
            cb([
                {
                    "text": this._info.Name,
                    "id": this._sheet.getId(),
                    "children": true
                }]);
        }
        else {
            var sheetId: string = node.id;
            var sheet = this._sheet.getSheetById(sheetId);

            var uri = sheet.getUrlBase("/childsummary");
            sheet._http.getAsync<IChildSummaryInfo>(uri).then((summaries) => {
                var childrenDetails = summaries.Children;
                // sheet.getChildrenSummaryAsync().then((childrenDetails: trcSheet.IChildSummaryInfoEntry[]) => {

                for (var i = 0; i < childrenDetails.length; i++) {
                    var child = childrenDetails[i];
                    this._cache2[child.SheetId] = child;
                }

                return sheet.getChildrenAsync().then((children: trcSheet.IGetChildrenResultEntry[]) => {

                    var newNodes: any[] = [];
                    for (var i = 0; i < children.length; i++) {
                        var child = children[i];
                        this._cache[child.Id] = child;

                        //  Include Version, Is Shared. 

                        var text = this.computeTitle(child.Id);

                        newNodes.push({
                            text: text,
                            id: child.Id,
                            children: true
                        });
                    }
                    cb(newNodes);
                });
            });
        }
    }

    private computeTitle(sheetId: string): string {
        var info: trcSheet.IGetChildrenResultEntry = this._cache[sheetId];
        var details = this._cache2[sheetId];

        var x = info.Name;

        var count = details.ChildInfo.CountRecords;
        x += " (" + count + " rows)";

        // Append version, easy way to see activity 
        var ver = details.ChildInfo.LatestVersion;
        if (ver > 0) {
            x += " (v" + ver + ")";
        }

        var shares = details.ShareInfo;
        if (shares != undefined && shares != null) {
            if (shares.length >= 1) {
                x += " [Shared]";
            }
        }

        if (info.Filter != null) {
            x += " [" + info.Filter + "]";
        }


        return x;
    }
}