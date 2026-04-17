// import { getAuth } from "@/features/auth/queries/get-auth";
// import { isOwner } from "@/features/auth/utils/is-owner";
// import { prisma } from "@/lib/prisma";
// import { ParsedSearchParams } from "../search-params";

// export const getTickets = async (
//   userId: string | undefined,
//   searchParams: ParsedSearchParams
// ) => {
//   try {
//     const auth = await getAuth();
//     const user = auth.user;

//     const where = {
//       ...(userId && user && { userId }),
//       ...(searchParams.search && {
//         OR: [
//           {
//             title: {
//               contains: searchParams.search,
//             },
//           },
//           // Optional: Also search in description if you have that field
//           // {
//           //   description: {
//           //     contains: searchParams.search,
//           //   },
//           // },
//         ],
//       }),
//     };

//     const skip = searchParams.size * searchParams.page;
//     const take = Math.min(searchParams.size, 100);

//     const [tickets, count] = await prisma.$transaction([
//       prisma.ticket.findMany({
//         where,
//         skip,
//         take,
//         orderBy: {
//           [searchParams.sortKey]: searchParams.sortValue,
//         },
//         include: {
//           user: {
//             select: {
//               username: true,
//             },
//           },
//         },
//       }),
//       prisma.ticket.count({ where }),
//     ]);

//     return {
//       list: tickets.map((ticket) => ({
//         ...(ticket as typeof ticket & {
//           status: "OPEN" | "DONE" | "IN_PROGRESS";
//         }),
//         isOwner: isOwner(user, ticket),
//       })),
//       metadata: {
//         count,
//         hasNextPage: count > skip + take,
//         totalPages: Math.ceil(count / searchParams.size),
//         currentPage: searchParams.page,
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching tickets:", error);
//     throw new Error("Failed to fetch tickets");
//   }
// };
