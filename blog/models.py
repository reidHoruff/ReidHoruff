from django.db import models
from django.core.urlresolvers import reverse

#for Article date creation and editing
import datetime

class Article(models.Model):
	url = models.SlugField(max_length=150, unique=True)
	title = models.CharField(max_length=150)
	body = models.TextField(max_length=50000)
	description = models.TextField(max_length=1000, blank=True)
	date_created = models.DateField(blank=True)
	date_last_edited = models.DateField(blank=True)
	special_page = models.BooleanField(default=False)
	escape_html = models.BooleanField(default=False)
	use_markdown = models.BooleanField(default=True)

	
	@staticmethod
	def get_by_url(url_slug):
		return Article.objects.get(url=url_slug)

	@staticmethod
	def all_normal_by_date():
		return Article.objects.all().order_by('date_created').filter(special_page=False)

	def absolute_url(self):
		return reverse('blog_view_article', args=[self.url])

	def save(self, *args, **kwargs):

		if not self.id:
			self.date_created = datetime.datetime.today()
		
		self.date_last_edited = datetime.datetime.today()

		super(Article, self).save(*args, **kwargs)

	def __unicode__(self):
		return self.title

