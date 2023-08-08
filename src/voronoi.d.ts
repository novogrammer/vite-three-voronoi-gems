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
    angle:number;
    getStartpoint():Vertex;
    getEndpoint():Vertex;
  }
  class Cell{
    site:Site;
    halfedges:Halfedge[];
    closeMe:boolean;
  }
  class Edge{
    lSite:Site;
    rSite:Site;
    va:Vertex;
    vb:Vertex;
  }
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
    compute(sites:Vertex[],bbox:Bbox):Diagram;
  }
  export = Voronoi;
}