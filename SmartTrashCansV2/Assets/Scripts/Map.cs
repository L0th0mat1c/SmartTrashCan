using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

public class Map : MonoBehaviour {

    public NavMeshSurface surfaces;

    public void Start () 
    {
        surfaces.BuildNavMesh ();    
    }

    public void Update ()
    {
        surfaces.BuildNavMesh ();  
    }
}