from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_paginated_response(self, data):

        try:
            return Response({
                "links": {
                    "next": self.get_next_link(),
                    "previous": self.get_previous_link()
                },
                "count": self.page.paginator.count,
                "total_pages": self.page.paginator.num_pages,
                "results": data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"scope": "get_paginated_response", "error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
