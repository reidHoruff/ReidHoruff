from django.conf.urls import patterns, include, url
from django.conf import settings
from django.contrib import admin
admin.autodiscover()

'''
admin
'''
urlpatterns = patterns('',
	url(r'^admin/', include(admin.site.urls)),
)

'''
static
'''
urlpatterns += patterns('',
	url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),
)

'''
blog
'''
urlpatterns += patterns('blog.views',
	url(r'^$', 'view_home', name='blog_view_home'),
	url(r'^(?P<url>.*)/$', 'view_article', name='blog_view_article'),
)