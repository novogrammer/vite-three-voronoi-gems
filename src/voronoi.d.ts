declare module "voronoi" {
  interface Vertex{
    x:number;
    y:number;
  }

  interface Site extends Vertex{
    voronoiId:number;
  }
  class Halfedge{
    site:Site;
    edge:Edge;
    angle?:number;
    getStartpoint():Vertex;
    getEndpoint():Vertex;
  }
  class Cell{
    site:Site;
    halfedges:Halfedge[];
    closeMe:boolean;
    constructor(site:Site);
  }
  class Edge{
    lSite:Site;
    rSite:Site;
    va:Vertex;
    vb:Vertex;
  }
  // class Beachsection{
  //   site:Site;
  //   rbPrevious?:number;
  // }
  // class CircleEvent{

  // }
  interface Bbox{
    xl:number;
    xr:number;
    yt:number;
    yb:number;
  }
  class Diagram{
    site:Site;
    cells:Cell[];
    edges:Edge[];
    vertices:Vertex[];
    execTime:number;
  }
  class Voronoi{
    vertices:Vertex[]|null;
    edges:Edge[]|null;
    cells:Cell[]|null;
    // toRecycle:[]|null;
    // createHalfedge(edge:Edge,lSite:Site,rSite:Site):Halfedge;
    // createVertex(x:number,y:number):Vertex;
    // createEdge(lSite:Site,rSite:Site,va:Vertex,vb:Vertex):Edge;
    // createBorderEdge(lSite:Site,va:Vertex,vb:Vertex):Edge;
    // setEdgeStartpoint(edge:Edge,lSite:Site,rSite:Site,vertex:Vertex):void;
    // setEdgeEndpoint(edge:Edge,lSite:Site,rSite:Site,vertex:Vertex):void;
    // createBeachsection(site:Site):Beachsection;
    // leftBreakPoint(arc:Beachsection,directrix:number):number;
    // rightBreakPoint(arc:Beachsection,directrix:number):number;
    // detachBeachsection(beachsection:Beachsection):void;
    // removeBeachsection(beachsection:Beachsection):void;
    // addBeachsection(site:Site):void;

    compute(sites:Vertex[],bbox:Bbox):Diagram;
  }
  export = Voronoi;
}