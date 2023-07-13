using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

[RequireComponent(typeof(LineRenderer))]
public class Camion : MonoBehaviour
{
    public GameObject[] target;
    public NavMeshAgent agent;
    public LineRenderer myLineRenderer;
    public GameObject warp;
    public float range = 1;
    private int current;
    public ParticleSystem[] listParticles;
    public bool goooo;
    public bool ramassage_en_cours;
    float timer = 0;
    float timer_on_start = 0;

    void Start() 
    {
        myLineRenderer = GetComponent<LineRenderer>();

        myLineRenderer.startWidth = 0.02f;
        myLineRenderer.endWidth = 0.02f;
        myLineRenderer.positionCount = 0;

        agent.Warp(warp.transform.position);
    }

    // Update is called once per frame
    void Update()
    {
        timer_on_start += Time.deltaTime;
        if (timer_on_start < 5) {
            agent.Warp(warp.transform.position);
        }
        
        if(!ramassage_en_cours) {
            goooo = true;
            ramassage_en_cours = true;
            for(var i = 0; i < listParticles.Length; i++) {
                if(listParticles[i].startColor == new Color(0, 128, 0, .5f)) {
                    goooo = false;
                    ramassage_en_cours = false;
                }
            }
        }
        
        if(goooo) {
            if(target[current].activeSelf) {
                if(getDistanceFromTarget() >= range) {
                    agent.SetDestination(target[current].transform.position);
                    DrawPath();
                } else {
                    if(listParticles[current].startColor == new Color(0, 128, 0, .5f)) {
                        current = (current + 1) % target.Length;
                    }
                    goooo = false;
                    ramassage_en_cours = false;
                    for(var i = 0; i < listParticles.Length; i++) {
                        if(listParticles[i].startColor != new Color(0, 128, 0, .5f)) {
                            goooo = true;
                            ramassage_en_cours = true;
                        }
                    }
                    if(!ramassage_en_cours) {
                        agent.SetDestination(warp.transform.position);
                        DrawPath();
                    }
                }
            }
        }
    }

    public bool setPositionOnLoad() {
        return true;
    }

    public float getDistanceFromTarget() {
        return Vector3.Distance(target[current].transform.position, transform.position);
    }

    private void OnDrawGizmosSelected() {
        Gizmos.color = Color.blue;
        Gizmos.DrawWireSphere(transform.position, range);
    }

    void DrawPath()
    {
        myLineRenderer.positionCount = agent.path.corners.Length + 1;
        myLineRenderer.SetPosition(0, transform.position);

        if(agent.path.corners.Length < 2) {
            return;
        }

        for(int i = 1; i < agent.path.corners.Length; i++) {
            Vector3 pointPosition = new Vector3(agent.path.corners[i].x, agent.path.corners[i].y, agent.path.corners[i].z);
            myLineRenderer.SetPosition(i, pointPosition);
        }
    }
}
