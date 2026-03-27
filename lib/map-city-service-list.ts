import type { City, ServiceListCityApiItem, ServiceListItem } from '@/lib/types/service';

export function mapCityServiceToListItem(
  item: ServiceListCityApiItem,
  city: Pick<City, 'id' | 'name' | 'slug'>,
): ServiceListItem {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    short_description: item.short_description,
    featured_image: item.featured_image,
    is_featured: item.is_featured,
    is_popular: item.is_popular,
    category: item.category,
    cheapest_package: item.packages,
    city_pages: [{ id: city.id, name: city.name }],
  };
}
