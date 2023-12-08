from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse
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

