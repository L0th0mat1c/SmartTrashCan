using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FlyFromTo : MonoBehaviour
{
    public float speed = 7f;

    private Transform target;
    private int waypointIndex = 0;
    private Animator animator;

    void Start()
    {
        target = Waypoints.points[0];
        animator.SetBool("flying", true);
    }
    private void Update() {
        Vector3 dir = target.position - transform.position;
        transform.Translate(dir.normalized * speed * Time.deltaTime, Space.World);
        transform.rotation = Quaternion.LookRotation (dir);
        

        if(Vector3.Distance(transform.position, target.position)<= 0.3){

            GetHexWaypoints();
        }
    }

    private void GetHexWaypoints(){
        
        if(waypointIndex >= Waypoints.points.Length - 1){
            waypointIndex = 0;
            target = Waypoints.points[0];
        }else{
            waypointIndex++;
            target = Waypoints.points[waypointIndex];
        }

    }
}
