package com.treblemaker.keypath.graph;

import com.treblemaker.keypath.graph.util.AdjacencyMatrixGraph;
import com.treblemaker.keypath.graph.util.Graph;
import com.treblemaker.keypath.graph.util.GraphType;
import com.treblemaker.keypath.graph.util.ShortestPathUnweighted;
import com.treblemaker.keypath.server.model.Link;

import java.util.ArrayList;
import java.util.List;

public class ChordPaths {

    public List<Link> addOrUpdateChordPathLinks(List<Link> newEdges, List<Link> originalEdges) {

        List<Link> newEdgesToAppend = new ArrayList<>();

        for (Link newEdge: newEdges) {
            boolean updateEdge = false;
            for(int i=0; i<originalEdges.size(); i++){
                if(newEdge.Source == originalEdges.get(i).Source && newEdge.Target == originalEdges.get(i).Target){
                    updateEdge = true;
                    originalEdges.get(i).setIsPath();
                }

                if(!updateEdge && newEdge.Target == originalEdges.get(i).Source && newEdge.Source == originalEdges.get(i).Target){
                    updateEdge = true;
                    originalEdges.get(i).setIsPath();
                }
            }

            if(!updateEdge) {
                newEdgesToAppend.add(newEdge);
            }
        }

        originalEdges.addAll(newEdgesToAppend);

        return originalEdges;
    }

    public List<Link> generateChordPath(List<Link> edges, KeyMembers keyMembers, Integer originNodeId, Integer destinationNodeId) {

        if(originNodeId == null) {
            originNodeId = 0;
        }

        if(destinationNodeId == null) {
            destinationNodeId = 83;
        }

        System.out.println(String.format("ORIGIN: %s, DESTINATION: %s ", originNodeId, destinationNodeId));

        Graph graph = new AdjacencyMatrixGraph(84, GraphType.UNDIRECTED);
        for (Link link : edges) {
            //System.out.println("EDGE S:" + link.Source + " T:" + link.Target);
            graph.addEdge(link.Source, link.Target);
        }

        List<Integer> idPath = ShortestPathUnweighted.shortestPath(graph, originNodeId, destinationNodeId);
        //0    1    2     3
        //0 -> 1 -> 72 -> 70
        List<Link> chordPath = new ArrayList<>();
        for (int i = 0; i < idPath.size(); i++) {
            if (i + 1 < idPath.size()) {
                chordPath.add(new Link(keyMembers.getById(idPath.get(i)).Id, keyMembers.getById(idPath.get(i + 1)).Id).setIsPath());
            }
        }

        return chordPath;
    }
}
