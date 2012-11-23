from django.shortcuts import render_to_response
from django.template import RequestContext
from blog.models import *
'''
renders the home view
'''
def view_home(request):
	render_vars = {
		'posts': Article.all_normal_by_date(),
	}

	return render_to_response('blog/home.html', render_vars, context_instance=RequestContext(request))

def view_article(request, url):
	render_vars = {
		'article': Article.get_by_url(url),
	}

	return render_to_response('blog/view.html', render_vars, context_instance=RequestContext(request))