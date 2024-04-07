import ast
import base64
import json
import traceback

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse, StreamingHttpResponse, HttpResponse
from rest_framework import status
from rest_framework.parsers import JSONParser

from .models import Project
from .serializer import ProjectSerializer

from .process.audioProcessor import AudioProcessor


# Create your views here.
@csrf_exempt
def project_api(request, project_id=None, user_id=None):

    if project_id is not None and request.method == 'GET':
        project = Project.objects.get(id=project_id)
        project_serializer = ProjectSerializer(project)
        return JsonResponse(project_serializer.data, safe=False, status=201)
    elif user_id is not None and request.method == 'GET':
        # All projects from a user
        projects = Project.objects.filter(user_id=user_id)
        if len(projects) > 1:
            projects_serializer = ProjectSerializer(projects, many=True)
        else:
            projects_serializer = ProjectSerializer(projects[0])
        return JsonResponse(projects_serializer.data, safe=False, status=201)
    elif request.method == 'GET':
        projects = Project.objects.all()
        projects_serializer = ProjectSerializer(projects, many=True)
        return JsonResponse(projects_serializer.data, safe=False, status=201)
    elif request.method == 'POST':
        project = JSONParser().parse(request)
        project_serializer = ProjectSerializer(data=project)
        if project_serializer.is_valid():
            project_serializer.save()
            return JsonResponse("Project created.", safe=False, status=201)
        else:
            print(project_serializer.errors)
        return JsonResponse("Failed to create project.", safe=False, status=400)
    elif request.method == 'PUT':
        new_project = JSONParser().parse(request)
        old_project = Project.objects.get(id=new_project['id'])
        project_serializer = ProjectSerializer(old_project, data=new_project)
        if project_serializer.is_valid():
            project_serializer.save()
            return JsonResponse(f"Project {new_project['id']} updated.", safe=False, status=201)
        return JsonResponse(f"Failed to update project {new_project['id']}.", safe=False, status=400)
    elif project_id is not None and request.method == 'DELETE':
        project = Project.objects.get(id=project_id)
        project.delete()
        return JsonResponse(f"Project {project_id} deleted.", safe=False, status=201)


@csrf_exempt
def audio_process_api(request):

    if request.method == 'POST':

        try:
            data = json.loads(request.body)
            print(data)
            tracks = data.get("tracksDataProcessed", [])

            base64_res_list = []
            base64_final_list = []
            for i, track in enumerate(tracks):
                # current_track = tracks[i]
                lyrics = track.get("lyrics")
                start_time = track.get("startTime")
                target_pitch_list = track.get("targetPitchList")
                target_duration_list = track.get("targetDurationList")

                audio_processor = (AudioProcessor()
                                   .generate(lyrics, target_duration_list)
                                   .set_pitch_to_avg(target_pitch_list)
                                   .edit_pitch(target_pitch_list)
                                   .edit_duration(target_duration_list, target_pitch_list)
                                   .remove_silence(target_pitch_list)
                                   .generate_final_audio(start_time)
                                   )

                # base64_res = audio_processor.base64_res
                # base64_final = audio_processor.base64_final
                base64_res_list.append({"id": track.get("trackId"), "data": audio_processor.base64_res})
                base64_final_list.append({"id": track.get("trackId"), "data": audio_processor.base64_final})

            # print(f"base64_final: {base64_final}")
            return JsonResponse(json.dumps({
                "dataArr": base64_res_list,
                "finalData": base64_final_list
            }), safe=False, status=status.HTTP_200_OK)

        except Exception as e:
            traceback.print_exc()
            return JsonResponse(f"Exception: {e}", safe=False, status=400)
