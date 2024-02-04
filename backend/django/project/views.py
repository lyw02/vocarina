import ast
import base64
import json

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse, StreamingHttpResponse, HttpResponse
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
            # bpm = request.POST.get('bpm')
            # numerator = request.POST.get('numerator')
            # denominator = request.POST.get('denominator')
            # timebase = 60 / bpm  # time per beat

            # lyrics = ast.literal_eval(request.POST.get('lyrics'))
            # target_pitch_list = ast.literal_eval(request.POST.get('target_pitch_list'))
            # target_duration_list = ast.literal_eval(request.POST.get('target_duration_list'))
            data = json.loads(request.body)
            lyrics = data.get('lyrics', [])
            target_pitch_list = data.get('target_pitch_list', [])
            target_duration_list = data.get('target_duration_list', [])

            audio_stream = (AudioProcessor()
                            .generate(lyrics)
                            .set_pitch_to_avg()
                            .edit_pitch(target_pitch_list)
                            .remove_silence()
                            .edit_duration(target_duration_list)
                            .remove_silence()
                            .generate_final_audio())
                            # .to_audio_stream()
                            # .__getattribute__("_audio_data_base64"))
            audio_file_path = rf"C:\Users\Jerry\Desktop\sampleMusic\final_audio.wav"
            with open(audio_file_path, "rb") as audio_file:
                audio_binary_data = audio_file.read()
            # 对音频数据进行base64编码
            audio_base64 = base64.b64encode(audio_binary_data).decode('utf-8')
            # 构建HttpResponse对象并设置Content-Type头
            response = HttpResponse(content_type="audio/wav")
            # 设置Content-Disposition头，让浏览器下载文件而不是尝试播放
            response['Content-Disposition'] = 'attachment; filename="audio.wav"'
            # 将base64编码的音频数据写入HttpResponse对象
            response.write(audio_base64)

            print(audio_stream)
            with open(r"C:\Users\Jerry\Desktop\sampleMusic\audio_base64.txt", "w") as file:
                file.write(audio_stream)
        except Exception as e:
            return JsonResponse(f"Exception: {e}", safe=False, status=400)

        # return JsonResponse(str(audio_stream), safe=False, status=201)
        # return HttpResponse(audio_stream, content_type="audio/wav", status=201)
        return response
