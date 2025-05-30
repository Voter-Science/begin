import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "@emotion/styled";

import * as trcSheet from "trc-sheet/sheet";

import { HorizontalList } from "trc-react/dist/common/HorizontalList";
import { Panel } from "trc-react/dist/common/Panel";
import { Copy } from "trc-react/dist/common/Copy";
import { Button } from "trc-react/dist/common/Button";
import { AccordionPanel } from "trc-react/dist/common/AccordionPanel";
import TRCContext from "trc-react/dist/context/TRCContext";
import { PluginShell } from "trc-react/dist/PluginShell";
import { SheetContainer } from "trc-react/dist/SheetContainer";

import { SheetTreeViewControl } from "./treehelper";

import { CardGrid, PluginCard } from "./PluginCard";

const TreeButton = Button.withComponent("a");
const StyledTreeButton = styled(TreeButton)`
  padding: 0.5rem 1rem;
  text-decoration: none;
`;

declare var _opts: any;

interface IState {
  treeName?: string;
  treeBeginUrl?: string;
  treeShareUrl?: string;
}

export class App extends React.Component<{}, IState> {
  static contextType = TRCContext;

  private baseUrl = `https://canvas.voter-science.com/plugin/${this.context._info.SheetId}`;

  constructor(props: {}, context: any) {
    super(props, context);

    this.state = {};
  }

  componentDidMount() {
    document.title = "Voter-Science: " + this.context._info.Name;

    const tree = new SheetTreeViewControl(
      "treeroot",
      this.context.SheetClient,
      this.context._info
    );
    tree.initTree((sheetId) => this.onTreeNodeSelect(sheetId));
  }

  private getGotoLinkForPlugin(pluginId: string, sheetId?: string): string {
    if (!sheetId) {
      sheetId = this.context.SheetId;
    }

    if (!_opts) {
      return (
        "https://canvas.voter-science.com/plugin/" + sheetId + "/" + pluginId
      );
    }

    return _opts.gotoUrl + "/" + sheetId + "/" + pluginId + "/index.html";
  }

  private onTreeNodeSelect(data: trcSheet.IGetChildrenResultEntry): void {
    const name = data.Name;
    const sheetId = data.Id;

    const beginUrl = this.getGotoLinkForPlugin("Begin", sheetId);
    const shareUrl = this.getGotoLinkForPlugin("Share", sheetId);

    this.setState({
      treeName: name,
      treeBeginUrl: beginUrl,
      treeShareUrl: shareUrl,
    });
  }

  public render() {
    return (
      <PluginShell
        title="Welcome to Voter-Science Canvasser"
        description={
          <>
            What would you like to do? See{" "}
            <a href="https://blog.voter-science.com/canvas/" target="_blank">
              Help
            </a>{" "}
            for more details.
          </>
        }
      >
        <Panel>
          <Copy>
            <p>
              Sheet name: <strong>{this.context._info.Name}</strong>
            </p>
            {this.context._info.ParentName ? (
              <p>
                Parent: <strong>{this.context._info.ParentName}</strong>
              </p>
            ) : null}
            <p>
              Total Rows: <strong>{this.context._info.CountRecords}</strong>
            </p>
          </Copy>
        </Panel>

        <AccordionPanel
          accordionNames={[
            "Contact voters",
            "Partition and share",
            "Data and targeting",
            "Reporting",
            "Other",
          ]}
        >
          <>
            <Copy>
              <p>Here are several different ways to contact voters.</p>
              <p>Use the reporting features to track your outreach efforts.</p>
              <p>
                If you want to apply these outreach tools to just a subset of
                the rows, use the partition feature to create a child sheet.
              </p>
            </Copy>

            <CardGrid>
              <PluginCard
                content={
                  <p>
                    Show list voters all on one page. This is like a{" "}
                    <strong>digital clipboard</strong>. You can also use this
                    view to <strong>print</strong>.
                  </p>
                }
                icon={<i className="fas fa-list-ul"></i>}
                title="ListView"
                url={
                  <a href={`${this.baseUrl}/listview`} target="_blank">
                    Use listview
                  </a>
                }
              />
              <PluginCard
                content={<p>Show voters on a map.</p>}
                icon={<i className="fas fa-map-marked-alt"></i>}
                title="Map"
                url={
                  <a href={`${this.baseUrl}/map.all`} target="_blank">
                    Use map
                  </a>
                }
              />
              <PluginCard
                content={
                  <>
                    <div>
                      <a href="https://canvas.voter-science.com/fwd/android">
                        <img
                          className="store-cta"
                          width="150"
                          src="https://voterscience.files.wordpress.com/2018/05/google-play.png?w=702"
                          alt=""
                        />
                      </a>
                    </div>
                    <div>
                      <a href="https://canvas.voter-science.com/fwd/ios">
                        <img
                          className="store-cta"
                          width="150"
                          src="https://voterscience.files.wordpress.com/2018/05/apple-app-store.png?w=702"
                        />
                      </a>
                    </div>
                    <p>Download the mobile app for better offline usage.</p>
                  </>
                }
                icon={<i className="fas fa-mobile-alt"></i>}
                title="Mobile App"
              />
              <PluginCard
                content={<p>Produce a mail list by household.</p>}
                icon={<i className="fas fa-envelope"></i>}
                title="Mailer"
                url={
                  <a href={`${this.baseUrl}/mailer`} target="_blank">
                    Use mailer
                  </a>
                }
              />
              <PluginCard
                content={
                  <p>
                    Create an online petition to raise awareness on an issue and email voters.
                  </p>
                }
                icon={<img src="http://trcanvasdata.blob.core.windows.net/publicimages/petition-logo2.png" width="68px" height="68px" /> }
                title="Petition"
                url={
                  <a href={"https://canvas.voter-science.com/fwd/trc_petition"} target="_blank">
                    Create Petition
                  </a>
                }
              />
            
            {false && (
            <PluginCard
                content={
                  <p>
                    Fundraiser helps you organize and target your fundraising lists, integrate with latest public data for lobbyists and historical donors, automatically provision and scale to any elected office, and expertly manage call logs from your smartphone. 
                  </p>
                }
                icon={<img src="http://trcanvasdata.blob.core.windows.net/publicimages/trf-logo.png" width="68px" height="68px" /> }
                title="Fundraiser"
                url={
                  <a href={"https://canvas.voter-science.com/fwd/trf"} target="_blank">
                    Fundraiser
                  </a>
                }
              />
            )}
            </CardGrid>
          </>

          <>
            <Copy>
              <p>
                Divide this sheet into sections (aka "child sheets"). Once you
                create these child sheets, you can then assign them out to
                others.
              </p>
              <p>
                <a href="https://blog.voter-science.com/2017/05/12/sharing-with-trc">
                  Learn more about how to share.
                </a>
              </p>
              <p>Here are the current child sheets:</p>
            </Copy>

            <div id="treeroot"></div>

            {this.state.treeName && (
              <HorizontalList>
                <StyledTreeButton href={this.state.treeBeginUrl} target="_blank">
                  Go to {this.state.treeName}
                </StyledTreeButton>
                <StyledTreeButton href={this.state.treeShareUrl} target="_blank">
                  Share {this.state.treeName}
                </StyledTreeButton>
              </HorizontalList>
            )}

            <Copy>
              <h3>Create new child sheets</h3>
            </Copy>

            <CardGrid>
              <PluginCard
                content={
                  <p>Create child sheets by drawing them out on a map.</p>
                }
                icon={<i className="fas fa-globe"></i>}
                title="Geofence"
                url={
                  <a href={`${this.baseUrl}/geofencing.beta`} target="_blank">
                    Use geofencing
                  </a>
                }
              />
              <PluginCard
                content={
                  <p>
                    Create child sheets via queries (aka filter) expressions.
                  </p>
                }
                icon={<i className="fas fa-filter"></i>}
                title="Filter"
                url={
                  <a href={`${this.baseUrl}/filter`} target="_blank">
                    Use Filter
                  </a>
                }
              />
            </CardGrid>

            <Copy>
              <h3>Share sheets</h3>

              <p>
                To share just a portion of this sheet, create a child sheet and
                then select it in tree control above to share out just the
                child.
              </p>
            </Copy>

            <div>
              <a href={`${this.baseUrl}/share`} target="_blank">
                Share entire sheet
              </a>
            </div>
          </>

          <>
            <Copy>
              <p>
                If you don't have time to contact every single person in this
                sheet, then target just the subset you want to contact. Targets
                get applied to all child sheets.
              </p>
              <p>
                <a href="https://blog.voter-science.com/canvass-targeting">
                  Learn more about targeting.
                </a>
              </p>
            </Copy>

            {!this.context._info.ParentId && (
              <CardGrid>
                <PluginCard
                  content={
                    <p>
                      Use query expressions to select a set of targets for this
                      sheet.
                    </p>
                  }
                  icon={<i className="fas fa-filter"></i>}
                  title="Filter"
                  url={
                    <a href={`${this.baseUrl}/filter`} target="_blank">
                      Use filter
                    </a>
                  }
                />
                <PluginCard
                  content={
                    <p>Search for an individual name within this sheet.</p>
                  }
                  icon={<i className="fas fa-search"></i>}
                  title="Search"
                  url={
                    <a href={`${this.baseUrl}/search`} target="_blank">
                      Use search
                    </a>
                  }
                />
                <PluginCard
                  content={
                    <p>
                      Upload new columns of data. These can either be a set of
                      targets determined elsewhere, or it can be data used in
                      the filters for setting targets.
                    </p>
                  }
                  icon={<i className="fas fa-upload"></i>}
                  title="Upload data"
                  url={
                    <a href={`${this.baseUrl}/datauploader`} target="_blank">
                      Use datauploader
                    </a>
                  }
                />
              </CardGrid>
            )}

            {this.context._info.ParentId && (
              <Copy>
                <p>Targeting can only be done at the parent sheet.</p>
              </Copy>
            )}

            {this.context._info.Columns.find(
              (x: any) => x.Name === "XTargetPri"
            ) && (
              <Copy>
                <p>Targets have been set for this sheet</p>
              </Copy>
            )}
          </>

          <>
            <Copy>
              <p>
                Reporting lets you track progress from your outreach efforts and
                also get a pulse on the data in the sheet.
              </p>
            </Copy>

            <CardGrid>
              <PluginCard
                content={
                  <p>
                    Primary reporting mechanism for tracking outeach efforts.
                    This lets you see per-user per-day activity.
                  </p>
                }
                icon={<i className="fas fa-users"></i>}
                title="Audit"
                url={
                  <a href={`${this.baseUrl}/audit`} target="_blank">
                    Use audit
                  </a>
                }
              />
              <PluginCard
                content={
                  <p>
                    Explore the data via query expressions and create charts.
                  </p>
                }
                icon={<i className="fas fa-chart-area"></i>}
                title="Explore Data and Chart"
                url={
                  <a href={`${this.baseUrl}/filter`} target="_blank">
                    Use filter
                  </a>
                }
              />
              <PluginCard
                content={
                  <p>Quick charts on overall demographics of the sheet.</p>
                }
                icon={<i className="fas fa-chart-pie"></i>}
                title="Demo-graphics"
                url={
                  <a href={`${this.baseUrl}/Demographics`} target="_blank">
                    Use demographics
                  </a>
                }
              />
              {this.context._info.Columns.find(
                (x: any) => x.Name === "PrecinctName"
              ) && (
                <PluginCard
                  content={<p>Quick charts per-precinct information.</p>}
                  icon={<i className="fas fa-chart-bar"></i>}
                  title="Precincts"
                  url={
                    <a href={`${this.baseUrl}/precinctreport`} target="_blank">
                      Use precinctreport
                    </a>
                  }
                />
              )}
              {this.context._info.Columns.find(
                (x: any) => x.Name === "XVoted"
              ) && (
                <PluginCard
                  content={
                    <p>
                      View ballot return status and Get-Out-The-Vote
                      information.
                    </p>
                  }
                  icon={<i className="fas fa-chart-line"></i>}
                  title="GOTV Turnout"
                  url={
                    <a href={`${this.baseUrl}/turnout`} target="_blank">
                      Use turnout
                    </a>
                  }
                />
              )}
            </CardGrid>
          </>

          {!this.context._info.ParentId ? (
            <>
              <CardGrid>
                <PluginCard
                  content={
                    <p>View other plugins. This shows more advanced features</p>
                  }
                  icon={<i className="fas fa-plug"></i>}
                  title="Plugins"
                  url={
                    <a href={`${this.baseUrl}/plugins`} target="_blank">
                      Plugins
                    </a>
                  }
                />
                
                {!this.context._info.SurveyId ? 
                (
                  <PluginCard
                    content={
                      <p>Edit Questions. This applies to this sheet and all child sheets.</p>
                    }
                    icon={<i className="fas fa-question"></i>}
                    title="Edit Questions"
                    url={
                      <a href={`${this.baseUrl}/editquestions`} target="_blank">
                        Edit Questions
                      </a>
                    }
                  />                
                )
                : 
                (
                  <p>This sheet's questions are bound to survey: <pre>{this.context._info.SurveyId}</pre></p>
                )
                }
              </CardGrid>
            </>
          ) : null}
        </AccordionPanel>
      </PluginShell>
    );
  }
}

ReactDOM.render(
  <SheetContainer fetchContents={false} requireTop={false}>
    <App />
  </SheetContainer>,
  document.getElementById("app")
);
