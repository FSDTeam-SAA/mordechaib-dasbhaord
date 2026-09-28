"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { planColors, statusColors } from "../organization-data";
import { Building2, ChevronLeft, ChevronRight, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { useOrganizationsQuery } from "@/hooks/use-organizations-query";
import {
  organizationPlans,
  organizationStatuses,
  organizationsPath,
  organizationRow,
  type OrganizationsPage,
} from "@/lib/organizations-api";
import { paginationPages } from "@/lib/subscriptions-admin";
import SubscriptionQueryState from "../../_components/SubscriptionQueryState";

const pageSize = 10;

export default function OrganizationsTable() {
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const searchRef = useRef<HTMLInputElement>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);
  const query = useOrganizationsQuery<OrganizationsPage>(
    organizationsPath({
      page,
      limit: pageSize,
      search: debouncedSearch,
      plan,
      status,
    }),
  );
  const total = query.data?.total ?? 0;
  const pageCount = Math.max(1, query.data?.totalPages ?? 1);
  const rows = query.error
    ? []
    : (query.data?.items ?? []).map(organizationRow);
  const pageNumbers = paginationPages(page, pageCount);
  useEffect(() => {
    if (query.data && page > pageCount) setPage(pageCount);
  }, [query.data, page, pageCount]);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const paginationClass =
    "h-9 w-9 cursor-pointer rounded-lg border-[#DDE3F0] bg-white p-0 text-sm font-normal text-[#8490A7] shadow-none hover:bg-[#F5F6FF] disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <section aria-label="Organizations" className="rounded-xl bg-[#F5F6FF] py-2 sm:py-3">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:w-[320px]">
          <Search
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-[#929AC0]"
            strokeWidth={1.5}
          />
          <Input
            ref={searchRef}
            aria-label="Search organizations"
            placeholder="Search..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className="h-11 rounded-lg border-[#E6EAF5] bg-white pl-11 pr-12 text-sm! text-[#30334C] shadow-none placeholder:text-[#929AC0] focus-visible:ring-[#607AFF]"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded bg-[#F9FAFF] px-1.5 py-1 text-[10px] text-[#939DC1]">
            ⌘K
          </kbd>
        </div>
        <div className="flex flex-wrap gap-3">
          <Select
            value={plan}
            onValueChange={(value) => {
              setPlan(value);
              setPage(1);
            }}
          >
            <SelectTrigger
              aria-label="Filter by plan"
              className="h-11! min-w-[110px] cursor-pointer rounded-lg border border-[#E6EAF5] bg-white px-3 text-sm text-[#68738D] shadow-none"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              {Object.entries(organizationPlans).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger
              aria-label="Filter by status"
              className="h-11! min-w-[120px] cursor-pointer rounded-lg border border-[#E6EAF5] bg-white px-3 text-sm text-[#68738D] shadow-none"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(organizationStatuses).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-[#E6EAF5] bg-white shadow-[0_2px_12px_#30334C04]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm text-[#424B63]">
          <caption className="sr-only">
            Organizations, owners, employee counts, joining dates, plans and
            account statuses
          </caption>
          <thead className="border-b border-[#E6EAF5] bg-[#FAFBFF]">
            <tr>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-[13px] font-semibold text-[#737D95]">
                Organization
              </th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-[13px] font-semibold text-[#737D95]">
                Owner
              </th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-[13px] font-semibold text-[#737D95]">
                Employees
              </th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-[13px] font-semibold text-[#737D95]">
                Joining date
              </th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-[13px] font-semibold text-[#737D95]">
                Plan
              </th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-[13px] font-semibold text-[#737D95]">
                Status
              </th>
              <th scope="col" className="w-20 px-5 py-4 text-right text-[13px] font-semibold text-[#737D95]">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F2F8]">
            {rows.map((organization) => (
              <tr key={organization.id} className="transition-colors hover:bg-[#FAFBFF]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F0F3FF] text-[#7B8FE6]">
                      <Building2 aria-hidden="true" className="size-[18px]" strokeWidth={1.5} />
                    </span>
                    <span title={organization.name} className="max-w-[220px] truncate font-medium text-[#242D43]">
                      {organization.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="block max-w-[180px] truncate" title={organization.owner}>
                    {organization.owner}
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  {organization.employees}
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  {organization.joined}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
                      planColors[organization.planType],
                    )}
                  >
                    {organization.plan}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
                      statusColors[organization.status],
                    )}
                  >
                    {organization.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Button
                    asChild
                    variant="outline"
                    className="ml-auto flex size-9 cursor-pointer items-center justify-center rounded-lg border-[#DDE4FF] bg-[#F7F9FF] p-0 text-[#5D7BF5] shadow-none transition-colors hover:border-[#99AAEF] hover:bg-[#EDF1FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#607AFF]"
                  >
                    <Link
                      href={`/organizations/${organization.id}`}
                      title="View organization details"
                      aria-label={`Details for ${organization.name}`}
                    >
                      <Eye className="size-[18px]!" strokeWidth={1.7} />
                      <span className="sr-only">Details</span>
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
            {(query.isPending || query.error) && (
              <tr>
                <td colSpan={7} className="p-5">
                  <SubscriptionQueryState
                    error={query.error}
                    retry={() => void query.refetch()}
                  />
                </td>
              </tr>
            )}
            {!query.isPending && !query.error && !rows.length && (
              <tr>
                <td
                  colSpan={7}
                  className="py-16 text-center text-sm text-[#929AC0]"
                >
                  No organizations match your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E6EAF5] px-5 py-4 text-sm text-[#8490A7]">
        <p aria-live="polite" className="text-sm text-[#8490A7]">
          Showing {total ? (page - 1) * pageSize + 1 : 0} to{" "}
          {Math.min((page - 1) * pageSize + rows.length, total)} of {total}{" "}
          results
        </p>
        <nav
          aria-label="Organization pagination"
          className="flex items-center gap-1.5"
        >
          <Button
            variant="outline"
            className={paginationClass}
            disabled={query.isFetching || page === 1}
            aria-label="Previous page"
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          {pageNumbers.map((number, index) => (
            <span key={number} className="flex gap-1.5">
              {index > 0 && number - pageNumbers[index - 1] > 1 && (
                <span
                  className={cn(
                    paginationClass,
                    "flex items-center justify-center border",
                  )}
                  aria-hidden="true"
                >
                  ...
                </span>
              )}
              <Button
                variant="outline"
                className={cn(
                  paginationClass,
                  page === number &&
                    "border-[#5D7BF5] bg-[#5D7BF5] font-medium text-white hover:bg-[#4B6CE3] hover:text-white",
                )}
                disabled={query.isFetching}
                aria-label={`Page ${number}`}
                aria-current={page === number ? "page" : undefined}
                onClick={() => setPage(number)}
              >
                {number}
              </Button>
            </span>
          ))}
          <Button
            variant="outline"
            className={paginationClass}
            disabled={query.isFetching || page >= pageCount}
            aria-label="Next page"
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </nav>
      </div>
      </div>
    </section>
  );
}
