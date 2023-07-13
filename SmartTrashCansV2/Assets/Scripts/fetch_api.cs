using System.Collections;
using System.Collections.Generic;
using UnityEngine.Networking;
using UnityEngine;
using Vuforia;

public class fetch_api : DefaultObserverEventHandler
{
    
    public GameObject[] listGarbages;
    public ParticleSystem[] garbageRendererList;
    public List<GameObject> garbages = new List<GameObject>();
    public GameObject prefab;
    private float x, y, z;
    public ObserverBehaviour mTarget;
    private bool mSwapModel = false;


    [System.Serializable]
public class Garbage
{
public string _id;
public string name;
public string code;
public string state;
public int fill_percentage;
public float x;
public float y;
public float z;
    }

[System.Serializable]
public class GarbageList
{
public Garbage[] garbage;
}

public GarbageList garbagesList = new GarbageList();

    float timer = 0;

    void GetData() => StartCoroutine(GetRequest());

    IEnumerator GetRequest()
    {
        string uri = "https://api-smart-trash-can-g13.herokuapp.com/garbages";
        using (UnityWebRequest request = UnityWebRequest.Get(uri))
        {
            // Request and wait for the desired page.
            yield return request.SendWebRequest();
            Debug.Log(request);
            if (request.isNetworkError || request.isHttpError)
                Debug.Log("error" + request.error);
            else
            {
                //Debug.Log("result" + request.downloadHandler.text);
                garbagesList = JsonUtility.FromJson<GarbageList>("{\"garbage\":" + request.downloadHandler.text + "}");
                //garbagesList.SetGameObjectForGarbage();
                Debug.Log("list   " + garbagesList.garbage.Length);
                x = 0.082f;
                y = 0.011f;
                z = 0.275f;

                for (int i = 0; i < garbagesList.garbage.Length; i++)
                {
                    Debug.Log("tesssssstttt" + garbagesList.garbage[i].z);

                    GameObject newGarbage = listGarbages[i];

                    var garbageRenderer = garbageRendererList[i];


                    if (garbagesList.garbage[i].state == "Full")
                    {
                        
                        garbageRenderer.startColor = new Color(255, 0, 0, .5f);
                    }
                    if(garbagesList.garbage[i].state == "Empty")
                    {

                        garbageRenderer.startColor = new Color(0, 128, 0, .5f);
                    }
                    if (garbagesList.garbage[i].state == "Typed")
                    {

                        garbageRenderer.startColor = new Color(255, 165, 0, .5f);
                    }
                    //newGarbage.transform.parent = GameObject.Find("CityObject").transform;
                    //newGarbage.transform.position = new Vector3((float)garbagesList.garbage[i].x, (float)garbagesList.garbage[i].y, (float)garbagesList.garbage[i].z);
                    //newGarbage.transform.localRotation = Quaternion.identity;

                    //newGarbage.name = garbagesList.garbage[i].name;
                    //newGarbage.transform.localScale = new Vector3(0.018f, 0.018f, 0.018f);
                    garbages.Add(newGarbage);
                }
            }



        }
    }

    // Start is called before the first frame update
    void Start()
    {
        GetData();

    }

    void Update()
    {
        timer += Time.deltaTime;

        if (timer > 5) {
            GetData();
            timer = 0;
        }
    }

}
